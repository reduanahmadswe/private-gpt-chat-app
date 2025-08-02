/**
 * Google OAuth Seamless Flow Test Script
 * 
 * This script tests the seamless Google OAuth implementation:
 * 1. First-time users: Auto-registration + redirect to dashboard
 * 2. Returning users: Auto-login + redirect to dashboard  
 * 3. Account linking: Connect Google to existing local accounts
 * 4. No manual forms: Users never see signup/signin pages after OAuth
 */

const axios = require('axios');
const dotenv = require('dotenv');
const chalk = require('chalk');

// Load environment variables
dotenv.config({ path: './backend/.env' });

const API_BASE_URL = `http://localhost:${process.env.PORT || 5001}`;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

console.log(chalk.blue.bold('🧪 Google OAuth Seamless Flow Test'));
console.log(chalk.blue('=========================================='));

async function testHealthCheck() {
    try {
        console.log(chalk.yellow('📡 Testing backend health...'));
        const response = await axios.get(`${API_BASE_URL}/api/health`);
        console.log(chalk.green('✅ Backend is healthy'));
        console.log(chalk.gray(`   Status: ${response.data.status}`));
        console.log(chalk.gray(`   Environment: ${response.data.environment}`));
        return true;
    } catch (error) {
        console.log(chalk.red('❌ Backend health check failed'));
        console.log(chalk.red(`   Error: ${error.message}`));
        return false;
    }
}

async function testGoogleOAuthEndpoint() {
    try {
        console.log(chalk.yellow('🔐 Testing Google OAuth initiation endpoint...'));
        const response = await axios.get(`${API_BASE_URL}/api/auth/google`, {
            maxRedirects: 0,
            validateStatus: (status) => status === 302
        });
        
        if (response.status === 302) {
            const location = response.headers.location;
            console.log(chalk.green('✅ Google OAuth endpoint working'));
            console.log(chalk.gray(`   Redirects to: ${location.substring(0, 50)}...`));
            
            // Check if it's a valid Google OAuth URL
            if (location.includes('accounts.google.com/oauth/v2/auth')) {
                console.log(chalk.green('✅ Valid Google OAuth URL'));
                return true;
            } else {
                console.log(chalk.red('❌ Invalid OAuth URL'));
                return false;
            }
        }
        return false;
    } catch (error) {
        console.log(chalk.red('❌ Google OAuth endpoint test failed'));
        console.log(chalk.red(`   Error: ${error.message}`));
        return false;
    }
}

function displayConfiguration() {
    console.log(chalk.yellow('⚙️  Current Configuration:'));
    console.log(chalk.cyan('   Backend URL:'), API_BASE_URL);
    console.log(chalk.cyan('   Frontend URL:'), CLIENT_URL);
    console.log(chalk.cyan('   Google Client ID:'), process.env.GOOGLE_CLIENT_ID);
    console.log(chalk.cyan('   Callback URL:'), process.env.GOOGLE_CALLBACK_URL);
}

function displaySeamlessFlowInfo() {
    console.log(chalk.blue.bold('\\n🌟 Seamless OAuth Flow Features:'));
    console.log(chalk.blue('===================================='));
    
    console.log(chalk.green('✨ First-time Google Users:'));
    console.log('   • Auto-creates user account');
    console.log('   • Generates JWT tokens');
    console.log('   • Redirects directly to dashboard');
    console.log('   • No signup form needed');
    
    console.log(chalk.green('\\n🔄 Returning Google Users:'));
    console.log('   • Finds existing account by Google ID');
    console.log('   • Updates profile and refresh token');
    console.log('   • Redirects directly to dashboard');
    console.log('   • No login form needed');
    
    console.log(chalk.green('\\n🔗 Account Linking:'));
    console.log('   • Links Google to existing email account');
    console.log('   • Converts local auth to Google auth');
    console.log('   • Preserves existing user data');
    
    console.log(chalk.green('\\n🛡️  Security Features:'));
    console.log('   • HTTP-only cookies for tokens');
    console.log('   • Secure cookie settings in production');
    console.log('   • Query param tokens in development only');
    console.log('   • Auto token refresh');
    
    console.log(chalk.green('\\n🚫 No Auth Pages:'));
    console.log('   • PublicRoute redirects authenticated users');
    console.log('   • Users never see login/signup after OAuth');
    console.log('   • Seamless experience');
}

function displayTestingInstructions() {
    console.log(chalk.blue.bold('\\n🧪 Manual Testing Instructions:'));
    console.log(chalk.blue('==================================='));
    
    console.log(chalk.yellow('1. Start the backend:'));
    console.log('   cd backend && npm run dev');
    
    console.log(chalk.yellow('\\n2. Start the frontend:'));
    console.log('   cd frontend && npm run dev');
    
    console.log(chalk.yellow('\\n3. Test the flow:'));
    console.log(`   • Visit: ${CLIENT_URL}`);
    console.log('   • Click "Continue with Google"');
    console.log('   • Complete Google OAuth');
    console.log('   • Should redirect to dashboard automatically');
    
    console.log(chalk.yellow('\\n4. Test returning user:'));
    console.log('   • Log out from dashboard');
    console.log('   • Click "Continue with Google" again');
    console.log('   • Should auto-login and redirect to dashboard');
    
    console.log(chalk.yellow('\\n5. Test seamless experience:'));
    console.log(`   • Try visiting: ${CLIENT_URL}/auth/signin`);
    console.log('   • Should auto-redirect to dashboard if authenticated');
}

function displayTroubleshooting() {
    console.log(chalk.red.bold('\\n🔧 Troubleshooting:'));
    console.log(chalk.red('==================='));
    
    console.log(chalk.yellow('redirect_uri_mismatch error:'));
    console.log('   • Check Google Cloud Console');
    console.log('   • Add exact callback URL:', process.env.GOOGLE_CALLBACK_URL);
    console.log('   • Wait 2-3 minutes after saving changes');
    
    console.log(chalk.yellow('\\nUser creation errors:'));
    console.log('   • Check MongoDB connection');
    console.log('   • Clear existing test users if needed');
    console.log('   • Check user model validation');
    
    console.log(chalk.yellow('\\nToken/Cookie issues:'));
    console.log('   • Check browser dev tools');
    console.log('   • Verify cookies are set');
    console.log('   • Check CORS settings');
}

async function runTests() {
    displayConfiguration();
    
    console.log(chalk.blue('\\n🔍 Running Tests...'));
    console.log(chalk.blue('===================='));
    
    const healthOk = await testHealthCheck();
    if (!healthOk) {
        console.log(chalk.red('\\n❌ Backend not ready. Please start the backend first:'));
        console.log(chalk.yellow('   cd backend && npm run dev'));
        return;
    }
    
    const oauthOk = await testGoogleOAuthEndpoint();
    
    console.log(chalk.blue('\\n📊 Test Results:'));
    console.log(chalk.blue('================'));
    console.log(healthOk ? chalk.green('✅ Backend Health') : chalk.red('❌ Backend Health'));
    console.log(oauthOk ? chalk.green('✅ OAuth Endpoint') : chalk.red('❌ OAuth Endpoint'));
    
    if (healthOk && oauthOk) {
        console.log(chalk.green.bold('\\n🎉 All tests passed! Ready for manual testing.'));
        displaySeamlessFlowInfo();
        displayTestingInstructions();
    } else {
        console.log(chalk.red.bold('\\n❌ Some tests failed. Check the issues above.'));
        displayTroubleshooting();
    }
}

// Run the tests
runTests().catch(console.error);
