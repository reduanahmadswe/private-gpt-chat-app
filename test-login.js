// Test script to debug login issues
const API_BASE_URL = 'https://aibondhu.vercel.app';

async function testAPI() {
    console.log('🧪 Testing API connectivity...');
    
    try {
        // Test 1: Health check
        console.log('📡 Testing health endpoint...');
        const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health check response:', healthData);
        
        // Test 2: Test endpoint
        console.log('📡 Testing debug endpoint...');
        const testResponse = await fetch(`${API_BASE_URL}/api/test`, {
            headers: {
                'Origin': 'https://aibondhuai.vercel.app'
            }
        });
        const testData = await testResponse.json();
        console.log('✅ Test endpoint response:', testData);
        
        // Test 3: Login attempt
        console.log('📡 Testing login endpoint...');
        const loginResponse = await fetch(`${API_BASE_URL}/api/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://aibondhuai.vercel.app'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'testpass123'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log('📝 Login response status:', loginResponse.status);
        console.log('📝 Login response data:', loginData);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testAPI();
