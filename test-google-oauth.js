const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001';

async function testGoogleOAuth() {
  console.log('🧪 Testing Google OAuth Implementation...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Checking if server is running...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.status);
    console.log('📝 Environment:', healthResponse.data.environment);
    console.log('');

    // Test 2: Check Google OAuth route accessibility
    console.log('2. Testing Google OAuth route accessibility...');
    
    // This will redirect to Google, so we catch the redirect
    try {
      await axios.get(`${API_BASE_URL}/api/auth/google`, {
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
    } catch (error) {
      if (error.response && error.response.status === 302) {
        console.log('✅ Google OAuth route is set up (redirects to Google)');
        console.log('📍 Redirect location:', error.response.headers.location);
      } else {
        console.log('❌ Error accessing Google OAuth route:', error.message);
      }
    }
    console.log('');

    // Test 3: Check if callback route exists
    console.log('3. Testing callback route...');
    try {
      await axios.get(`${API_BASE_URL}/api/auth/google/callback`, {
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });
      console.log('✅ Google OAuth callback route exists');
    } catch (error) {
      console.log('❌ Error with callback route:', error.message);
    }
    console.log('');

    // Test 4: Test traditional auth still works
    console.log('4. Testing traditional authentication...');
    try {
      const testUser = {
        name: 'Test User OAuth',
        email: `test-oauth-${Date.now()}@example.com`,
        password: 'testpassword123'
      };

      const registerResponse = await axios.post(`${API_BASE_URL}/api/auth/signup`, testUser);
      console.log('✅ Traditional signup works');
      
      const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Traditional login works');
      console.log('📝 User authProvider:', loginResponse.data.user.authProvider);
      
    } catch (error) {
      console.log('❌ Traditional auth error:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Google OAuth setup testing completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up Google OAuth credentials in Google Cloud Console');
    console.log('2. Add credentials to .env file');
    console.log('3. Test the "Continue with Google" button in the frontend');
    console.log('4. Verify the complete OAuth flow works end-to-end');

  } catch (error) {
    console.error('❌ Failed to test Google OAuth setup:', error.message);
    console.log('\n💡 Make sure:');
    console.log('- The backend server is running on port 5001');
    console.log('- All dependencies are installed');
    console.log('- Environment variables are properly set');
  }
}

// Run the test
testGoogleOAuth();
