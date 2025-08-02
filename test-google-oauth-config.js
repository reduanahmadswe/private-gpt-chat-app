const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './backend/.env' });

console.log('🔍 Google OAuth Configuration Test');
console.log('=====================================');

console.log('✅ Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('✅ Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '***HIDDEN***' : '❌ NOT SET');
console.log('✅ Callback URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('✅ Backend Port:', process.env.PORT);

console.log('\n🎯 Expected Configuration in Google Cloud Console:');
console.log('=====================================');
console.log('📋 Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('📋 Authorized Redirect URI:', process.env.GOOGLE_CALLBACK_URL);

console.log('\n🚀 Test URLs:');
console.log('=====================================');
console.log('🌐 Backend Health:', `http://localhost:${process.env.PORT}/api/health`);
console.log('🔐 Google OAuth Start:', `http://localhost:${process.env.PORT}/api/auth/google`);
console.log('🔄 Google OAuth Callback:', process.env.GOOGLE_CALLBACK_URL);

console.log('\n📝 Next Steps:');
console.log('=====================================');
console.log('1. Go to Google Cloud Console');
console.log('2. Navigate to APIs & Services → Credentials');
console.log('3. Find your OAuth 2.0 Client ID');
console.log('4. Add this exact redirect URI:', process.env.GOOGLE_CALLBACK_URL);
console.log('5. Save the changes');
console.log('6. Wait 2-3 minutes for changes to take effect');
console.log('7. Start your backend: npm run dev');
console.log('8. Test the Google login');
