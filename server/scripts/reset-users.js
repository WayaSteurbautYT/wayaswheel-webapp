const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey);

async function deleteAllUsers() {
  try {
    console.log('Fetching all users...');
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      process.exit(1);
    }

    console.log(`Found ${users.length} users`);

    for (const user of users) {
      console.log(`Deleting user: ${user.email} (${user.id})`);
      const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        console.error(`Error deleting user ${user.email}:`, deleteError);
      } else {
        console.log(`✓ Deleted ${user.email}`);
      }
    }

    // Also delete all profiles
    console.log('\nDeleting all profiles...');
    const { error: profilesError } = await adminClient
      .from('profiles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (profilesError) {
      console.error('Error deleting profiles:', profilesError);
    } else {
      console.log('✓ Deleted all profiles');
    }

    console.log('\n✓ All users and profiles deleted successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteAllUsers();
