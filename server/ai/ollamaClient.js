const axios = require('axios');
const { spawn } = require('child_process');
const os = require('os');
const { execSync } = require('child_process');

class OllamaClient {
  constructor(host = null) {
    // Try to find Ollama on common ports if no host specified
    this.host = host || this.findOllamaHost();
    this.client = axios.create({
      baseURL: this.host,
      timeout: 60000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  findOllamaHost() {
    const commonPorts = [11434, 11435, 11436];
    const hosts = ['localhost', '127.0.0.1'];
    
    // Check environment variable first
    if (process.env.OLLAMA_HOST) {
      return process.env.OLLAMA_HOST;
    }
    
    // Return default, will try to connect in checkHealth
    return 'http://localhost:11434';
  }

  async checkHealth() {
    const commonPorts = [11434, 11435, 11436];
    const hosts = ['localhost', '127.0.0.1'];
    
    // Try environment variable first
    if (process.env.OLLAMA_HOST) {
      try {
        console.log('Checking Ollama at configured host:', process.env.OLLAMA_HOST);
        const response = await axios.get(`${process.env.OLLAMA_HOST}/api/tags`, {
          timeout: 5000
        });
        console.log('Ollama found at configured host');
        return { available: true, models: response.data.models || [], host: process.env.OLLAMA_HOST };
      } catch (error) {
        console.log('Configured host failed, trying other ports');
      }
    }
    
    // Try common ports
    for (const port of commonPorts) {
      for (const host of hosts) {
        const url = `http://${host}:${port}`;
        try {
          console.log(`Trying Ollama at: ${url}/api/tags`);
          const response = await axios.get(`${url}/api/tags`, {
            timeout: 5000
          });
          console.log(`Ollama found at: ${url}`);
          console.log('Models:', response.data.models);
          return { available: true, models: response.data.models || [], host: url };
        } catch (error) {
          console.log(`Failed to connect to ${url}: ${error.message}`);
        }
      }
    }
    
    console.error('Ollama not found on any common port');
    return { 
      available: false, 
      error: 'Ollama not found. Please ensure Ollama is running (ollama serve) and you have pulled at least one model (ollama pull llama3.2)',
      triedHosts: commonPorts.map(p => `localhost:${p}`).concat(commonPorts.map(p => `127.0.0.1:${p}`))
    };
  }

  async chat(model, messages, options = {}) {
    try {
      const response = await this.client.post('/api/chat', {
        model,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 2000,
          ...options
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ollama chat failed: ${error.message}`);
    }
  }

  async generate(model, prompt, options = {}) {
    try {
      // Check if it's a cloud model
      if (model.includes(':cloud')) {
        return await this.generateCloud(model, prompt, options);
      }

      const response = await this.client.post('/api/generate', {
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 2000,
          ...options
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Generation failed: ${error.message}`);
    }
  }

  async generateCloud(model, prompt, options = {}) {
    // Cloud model integration - could use OpenAI-compatible API or other cloud provider
    // For now, this is a placeholder that can be configured with cloud provider credentials
    try {
      // Example: Could integrate with OpenAI, Anthropic, or other cloud LLM providers
      // This would require API keys in environment variables
      const cloudProvider = process.env.CLOUD_LLM_PROVIDER || 'openai';
      
      if (cloudProvider === 'openai') {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error('OpenAI API key not configured');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model === 'qwen3.5:397b-cloud' ? 'gpt-4-turbo' : 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            ...options
          })
        });

        if (!response.ok) {
          throw new Error(`Cloud API error: ${response.statusText}`);
        }

        const data = await response.json();
        return { response: data.choices[0].message.content };
      }
      
      throw new Error('Cloud provider not configured');
    } catch (error) {
      throw new Error(`Cloud generation failed: ${error.message}`);
    }
  }

  async pullModel(modelName) {
    return new Promise((resolve, reject) => {
      const process = spawn('ollama', ['pull', modelName]);
      let output = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          reject(new Error(`Failed to pull model: code ${code}`));
        }
      });
    });
  }

  async getAvailableModels() {
    try {
      const response = await this.client.get('/api/tags');
      return response.data.models || [];
    } catch (error) {
      return [];
    }
  }

  // Tool calling for vision, web search, code generation
  async useTool(toolName, input, model = 'llama3.2') {
    const toolPrompts = {
      vision: `Analyze this visual content and describe it in detail for a game context: ${input}`,
      webSearch: `Search for information about: ${input}. Provide relevant results for game content.`,
      codeGen: `Write clean, well-commented code for: ${input}. Use modern JavaScript/React.`,
      textGen: `Generate creative content for: ${input}. Make it engaging and fit for a game.`,
      gameMode: `Design a new game mode based on: ${input}. Include rules, mechanics, and scoring.`,
      ending: `Create a unique ending for a wheel spin based on: ${input}. Make it memorable.`
    };

    const prompt = toolPrompts[toolName] || input;
    return this.generate(model, prompt);
  }
}

// Device capability detection
class DeviceCapabilities {
  static detect() {
    const platform = os.platform();
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    // GPU detection (basic)
    let hasGPU = false;
    let gpuInfo = null;
    
    try {
      if (platform === 'win32') {
        const gpu = execSync('wmic path win32_VideoController get name').toString();
        hasGPU = gpu.includes('NVIDIA') || gpu.includes('AMD') || gpu.includes('Intel');
        gpuInfo = gpu.trim();
      } else if (platform === 'darwin') {
        const gpu = execSync('system_profiler SPDisplaysDataType').toString();
        hasGPU = gpu.includes('Chip') || gpu.includes('GPU');
        gpuInfo = gpu.trim();
      } else {
        const gpu = execSync('lspci | grep -i vga').toString();
        hasGPU = gpu.length > 0;
        gpuInfo = gpu.trim();
      }
    } catch (error) {
      console.log('GPU detection failed:', error.message);
    }

    const canRunLocalLLM = {
      capable: totalMemory >= 8 * 1024 * 1024 * 1024, // 8GB RAM minimum
      recommended: totalMemory >= 16 * 1024 * 1024 * 1024, // 16GB recommended
      hasGPU,
      gpuInfo,
      cpuCount: cpus.length,
      totalMemoryGB: Math.round(totalMemory / (1024 * 1024 * 1024)),
      freeMemoryGB: Math.round(freeMemory / (1024 * 1024 * 1024))
    };

    return {
      platform,
      cpus: cpus.length,
      totalMemory,
      freeMemory,
      canRunLocalLLM
    };
  }

  static getRecommendedModel(capabilities, useCloud = false) {
    // Model selection based on device capabilities
    // Qwen 3.5 models with vision support (256K context)
    if (useCloud) {
      return {
        model: 'qwen3.5:cloud',
        fallbackModel: 'qwen3.5:397b-cloud',
        reason: 'Using Qwen 3.5 Cloud for maximum quality'
      };
    }

    if (capabilities.canRunLocalLLM.hasGPU && capabilities.canRunLocalLLM.totalMemoryGB >= 16) {
      return {
        model: 'qwen3.5:latest',
        fallbackModel: 'qwen3.5:9b',
        reason: 'High-end GPU with 16GB+ RAM - using Qwen 3.5 (6.6GB, vision support)'
      };
    } else if (capabilities.canRunLocalLLM.hasGPU && capabilities.canRunLocalLLM.totalMemoryGB >= 8) {
      return {
        model: 'qwen3.5:4b',
        fallbackModel: 'qwen3.5:2b',
        reason: 'GPU with 8GB+ RAM - using Qwen 3.5 4B (3.4GB, vision support)'
      };
    } else if (capabilities.canRunLocalLLM.totalMemoryGB >= 6) {
      return {
        model: 'qwen3.5:4b',
        fallbackModel: 'qwen3.5:2b',
        reason: '6GB+ RAM - using Qwen 3.5 4B (3.4GB, vision support)'
      };
    } else if (capabilities.canRunLocalLLM.totalMemoryGB >= 4) {
      return {
        model: 'qwen3.5:2b',
        fallbackModel: 'qwen3.5:0.8b',
        reason: '4GB+ RAM - using Qwen 3.5 2B (2.7GB, vision support)'
      };
    } else {
      return {
        model: 'qwen3.5:0.8b',
        fallbackModel: 'qwen3.5:cloud',
        reason: 'Low RAM - using Qwen 3.5 0.8B (1.0GB, vision support) or cloud fallback'
      };
    }
  }
}

module.exports = { OllamaClient, DeviceCapabilities };
