const express = require('express');
const router = express.Router();
const SupabaseClient = require('../supabase/client');

const supabase = new SupabaseClient();

// POST /api/auth/signup - Sign up new user
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    console.log('Signup request:', { email, username, passwordLength: password?.length });

    if (!email || !username || !password) {
      return res.status(400).json({
        error: 'Email, username, and password are required'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters'
      });
    }

    console.log('Calling supabase.signUp...');
    const result = await supabase.signUp(email, password, username);
    console.log('Supabase result:', result);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      user: result.data.user,
      data: result.data,
      message: result.message || 'Verification code sent to your email'
    });
  } catch (error) {
    console.error('Sign up failed:', error);
    res.status(500).json({
      error: 'Failed to sign up: ' + error.message
    });
  }
});

// POST /api/auth/login - Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login request:', { email });

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    console.log('Calling supabase.signIn...');
    const result = await supabase.signIn(email, password);
    console.log('Supabase result:', result);

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Check if user is verified
    const { data: profile, error: profileError } = await supabase.adminClient
      .from('profiles')
      .select('is_verified, username')
      .eq('id', result.data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    if (!profile || !profile.is_verified) {
      return res.status(403).json({
        error: 'Please verify your email first',
        requiresVerification: true
      });
    }

    // Get the session token
    const { data: { session } } = await supabase.client.auth.getSession();

    const sessionToken = session?.access_token || result.data.session?.access_token;

    // Create or update logged_in session
    if (sessionToken && result.data.user?.id) {
      // Check if session already exists
      const { data: existingSession } = await supabase.adminClient
        .from('logged_in')
        .select('id')
        .eq('session_token', sessionToken)
        .single();

      if (existingSession) {
        // Update last_active
        await supabase.adminClient
          .from('logged_in')
          .update({
            last_active: new Date(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          })
          .eq('id', existingSession.id);
      } else {
        // Create new session
        const { error: sessionError } = await supabase.adminClient
          .from('logged_in')
          .insert({
            user_id: result.data.user.id,
            session_token: sessionToken,
            is_guest: false
          });

        if (sessionError) {
          console.error('Failed to create logged_in session:', sessionError);
        }
      }
    }

    res.json({
      success: true,
      user: {
        ...result.data.user,
        user_metadata: {
          username: profile.username
        }
      },
      token: sessionToken,
      data: result.data
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({
      error: 'Failed to login: ' + error.message
    });
  }
});

// POST /api/auth/verify - Verify email with code
router.post('/verify', async (req, res) => {
  try {
    const { email, code, password } = req.body;

    console.log('Verify request:', { email, code, codeLength: code?.length });

    if (!email || !code) {
      return res.status(400).json({
        error: 'Email and verification code are required'
      });
    }

    // Find user by email in auth.users
    const { data: { users }, error: usersError } = await supabase.adminClient.auth.admin.listUsers();
    if (usersError) {
      console.error('Failed to list users:', usersError);
      return res.status(500).json({
        error: 'Failed to verify user'
      });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({
        error: 'User not found'
      });
    }

    console.log('Found user:', user.id);

    // Get profile by user ID
    const { data: profile, error: profileError } = await supabase.adminClient
      .from('profiles')
      .select('id, username, verification_code, code_expires_at, is_verified')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return res.status(400).json({
        error: 'Profile not found'
      });
    }

    console.log('Profile data:', {
      id: profile.id,
      username: profile.username,
      hasCode: !!profile.verification_code,
      codeLength: profile.verification_code?.length,
      storedCode: profile.verification_code,
      enteredCode: code.toUpperCase(),
      isVerified: profile.is_verified
    });

    // Check if already verified
    if (profile.is_verified) {
      return res.json({
        success: true,
        message: 'Already verified'
      });
    }

    // Check if code matches and hasn't expired
    if (!profile.verification_code) {
      console.error('No verification code found in profile');
      return res.status(400).json({
        error: 'No verification code found. Please sign up again.'
      });
    }

    if (profile.verification_code !== code.toUpperCase()) {
      console.log('Code mismatch:', {
        stored: profile.verification_code,
        entered: code.toUpperCase()
      });
      return res.status(400).json({
        error: 'Invalid verification code'
      });
    }

    if (new Date(profile.code_expires_at) < new Date()) {
      return res.status(400).json({
        error: 'Verification code has expired'
      });
    }

    console.log('Code verified, marking user as verified');

    // Mark user as verified
    const { error: updateError } = await supabase.adminClient
      .from('profiles')
      .update({
        is_verified: true,
        verification_code: null,
        code_expires_at: null
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error('Failed to mark user as verified:', updateError);
      return res.status(500).json({
        error: 'Failed to verify user'
      });
    }

    // Auto-login after verification if password is provided
    if (password) {
      const loginResult = await supabase.signIn(email, password);
      if (loginResult.success) {
        const { data: { session } } = await supabase.client.auth.getSession();

        // Create logged_in session
        const sessionToken = session?.access_token || loginResult.data.session?.access_token;
        if (sessionToken && loginResult.data.user?.id) {
          const { error: sessionError } = await supabase.adminClient
            .from('logged_in')
            .insert({
              user_id: loginResult.data.user.id,
              session_token: sessionToken,
              is_guest: false
            });

          if (sessionError) {
            console.error('Failed to create logged_in session:', sessionError);
          }
        }

        return res.json({
          success: true,
          message: 'Verification successful, logged in',
          user: loginResult.data.user,
          token: sessionToken
        });
      }
    }

    res.json({
      success: true,
      message: 'Verification successful'
    });
  } catch (error) {
    console.error('Verification failed:', error);
    res.status(500).json({
      error: 'Failed to verify: ' + error.message
    });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', async (req, res) => {
  try {
    const { token } = req.body;

    // Remove logged_in session
    if (token) {
      const { error: sessionError } = await supabase.adminClient
        .from('logged_in')
        .delete()
        .eq('session_token', token);

      if (sessionError) {
        console.error('Failed to remove logged_in session:', sessionError);
      }
    }

    const result = await supabase.signOut();

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Logout failed:', error);
    res.status(500).json({
      error: 'Failed to logout: ' + error.message
    });
  }
});

// POST /api/auth/check-session - Check if session is valid for auto-login
router.post('/check-session', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token is required'
      });
    }

    // Check if session exists and is not expired
    const { data: session, error: sessionError } = await supabase.adminClient
      .from('logged_in')
      .select(`
        id,
        user_id,
        expires_at,
        is_guest,
        profiles (
          id,
          username,
          total_spins,
          total_doom,
          games_played
        )
      `)
      .eq('session_token', token)
      .single();

    if (sessionError || !session) {
      return res.status(401).json({
        error: 'Invalid session'
      });
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Remove expired session
      await supabase.adminClient
        .from('logged_in')
        .delete()
        .eq('id', session.id);

      return res.status(401).json({
        error: 'Session expired'
      });
    }

    // Update last_active
    await supabase.adminClient
      .from('logged_in')
      .update({
        last_active: new Date(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      })
      .eq('id', session.id);

    res.json({
      success: true,
      user: {
        id: session.profiles.id,
        email: session.profiles.username, // Using username as email for now
        user_metadata: {
          username: session.profiles.username
        }
      },
      is_guest: session.is_guest,
      token: token
    });
  } catch (error) {
    console.error('Check session failed:', error);
    res.status(500).json({
      error: 'Failed to check session: ' + error.message
    });
  }
});

// POST /api/auth/guest - Create guest session
router.post('/guest', async (req, res) => {
  try {
    const { username, token } = req.body;

    if (!username || !token) {
      return res.status(400).json({
        error: 'Username and token are required'
      });
    }

    // Create guest session
    const { error: sessionError } = await supabase.adminClient
      .from('logged_in')
      .insert({
        user_id: null, // Guests don't have a user_id
        session_token: token,
        is_guest: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours for guests
      });

    if (sessionError) {
      console.error('Failed to create guest session:', sessionError);
      return res.status(500).json({
        error: 'Failed to create guest session'
      });
    }

    res.json({
      success: true,
      message: 'Guest session created'
    });
  } catch (error) {
    console.error('Guest session failed:', error);
    res.status(500).json({
      error: 'Failed to create guest session: ' + error.message
    });
  }
});

// GET /api/auth/user - Get current user
router.get('/user', async (req, res) => {
  try {
    const result = await supabase.getCurrentUser();

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Get user failed:', error);
    res.status(500).json({
      error: 'Failed to get user'
    });
  }
});

// GET /api/auth/profile/:userId - Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await supabase.getProfile(userId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Get profile failed:', error);
    res.status(500).json({
      error: 'Failed to get profile'
    });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { userId, updates } = req.body;

    if (!userId || !updates) {
      return res.status(400).json({
        error: 'userId and updates are required'
      });
    }

    const result = await supabase.updateProfile(userId, updates);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Update profile failed:', error);
    res.status(500).json({
      error: 'Failed to update profile'
    });
  }
});

module.exports = router;
