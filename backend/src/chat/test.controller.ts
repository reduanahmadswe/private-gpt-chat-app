import { Request, Response } from 'express';
import { envVars } from '../config/env';

export class TestController {
  async testOpenRouter(req: Request, res: Response) {
    try {
      console.log('🧪 Testing OpenRouter API...');
      console.log('🔑 API Key present:', !!envVars.OPENROUTER_API_KEY);
      console.log('🔑 API Key first 20 chars:', envVars.OPENROUTER_API_KEY?.substring(0, 20) + '...');
      console.log('🌐 Base URL:', envVars.OPENAI_API_BASE_URL);

      const response = await fetch(`${envVars.OPENAI_API_BASE_URL}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${envVars.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Models API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Models API Error:', errorText);
        return res.status(500).json({
          success: false,
          message: 'OpenRouter API test failed',
          status: response.status,
          error: errorText
        });
      }

      const data: any = await response.json();
      console.log('✅ Models API Success - Available models count:', data.data?.length || 0);

      res.json({
        success: true,
        message: 'OpenRouter API test successful',
        modelsCount: data.data?.length || 0,
        apiKeyPresent: !!envVars.OPENROUTER_API_KEY
      });

    } catch (error: any) {
      console.error('🔥 Test error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Test failed',
        error: error.message
      });
    }
  }
}
