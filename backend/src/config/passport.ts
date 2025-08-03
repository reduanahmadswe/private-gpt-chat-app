import passport from 'passport';
import { Profile as FacebookProfile, Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { User } from '../user/user.model';
import { envVars } from './env';

// Serialize user for session
passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL,
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done) => {
            try {
                console.log('🔑 Google OAuth profile received:', {
                    id: profile.id,
                    email: profile.emails?.[0]?.value,
                    name: profile.displayName,
                });

                const email = profile.emails?.[0]?.value;
                if (!email) {
                    console.error('❌ No email found in Google profile');
                    return done(new Error('No email found in Google profile'), false);
                }

                // First, check if user already exists with Google ID
                let existingUser = await User.findOne({ googleId: profile.id });

                if (existingUser) {
                    console.log('✅ Existing Google user found by Google ID:', existingUser.email);
                    // Update refresh token and profile info
                    existingUser.refreshToken = refreshToken;
                    existingUser.name = profile.displayName || existingUser.name;
                    existingUser.avatar = profile.photos?.[0]?.value || existingUser.avatar;
                    await existingUser.save();
                    return done(null, existingUser);
                }

                // Second, check if user exists with same email (any auth provider)
                existingUser = await User.findOne({ email: email });

                if (existingUser) {
                    console.log('🔄 Linking Google account to existing user:', existingUser.email);
                    // Link Google account to existing user
                    existingUser.googleId = profile.id;
                    existingUser.authProvider = 'google'; // Update to Google auth
                    existingUser.avatar = profile.photos?.[0]?.value || existingUser.avatar;
                    existingUser.refreshToken = refreshToken;
                    // Update name if it's better from Google
                    if (profile.displayName && profile.displayName.length > existingUser.name.length) {
                        existingUser.name = profile.displayName;
                    }
                    await existingUser.save();
                    return done(null, existingUser);
                }

                // Create new user - no existing user found
                console.log('🆕 Creating new Google user for:', email);
                const newUser = new User({
                    name: profile.displayName || 'Google User',
                    email: email,
                    googleId: profile.id,
                    avatar: profile.photos?.[0]?.value,
                    authProvider: 'google',
                    refreshToken: refreshToken,
                    // No password needed for Google OAuth users
                });

                const savedUser = await newUser.save();
                console.log('✅ New Google user created successfully:', savedUser.email);

                return done(null, savedUser);
            } catch (error) {
                console.error('❌ Google OAuth error:', error);
                return done(error, false);
            }
        }
    )
);

// Facebook OAuth Strategy (conditional - only if environment variables are provided)
if (envVars.FACEBOOK_CLIENT_ID && envVars.FACEBOOK_CLIENT_SECRET && envVars.FACEBOOK_CALLBACK_URL) {
    passport.use(
        new FacebookStrategy(
            {
                clientID: envVars.FACEBOOK_CLIENT_ID,
                clientSecret: envVars.FACEBOOK_CLIENT_SECRET,
                callbackURL: envVars.FACEBOOK_CALLBACK_URL,
                profileFields: ['id', 'displayName', 'emails', 'photos']
            },
            async (accessToken: string, refreshToken: string, profile: FacebookProfile, done) => {
                try {
                    console.log('🔑 Facebook OAuth profile received:', {
                        id: profile.id,
                        email: profile.emails?.[0]?.value,
                        name: profile.displayName,
                    });

                    // For Facebook, we'll use the Facebook ID as the primary identifier
                    // Email might not be available due to Facebook's privacy changes
                    let email = profile.emails?.[0]?.value;

                    // If no email, create a placeholder email using Facebook ID
                    if (!email) {
                        email = `facebook_${profile.id}@facebook.placeholder.com`;
                        console.log('⚠️ No public email from Facebook, using placeholder:', email);
                    }

                    // First, check if user already exists with Facebook ID
                    let existingUser = await User.findOne({ facebookId: profile.id });

                    if (existingUser) {
                        console.log('✅ Existing Facebook user found by Facebook ID:', existingUser.email);
                        // Update profile info if needed
                        existingUser.name = profile.displayName || existingUser.name;
                        existingUser.avatar = existingUser.avatar || profile.photos?.[0]?.value;
                        await existingUser.save();
                        return done(null, existingUser);
                    }

                    // Only check for email match if it's a real email (not placeholder)
                    if (!email.includes('facebook.placeholder.com')) {
                        // Check if user exists with same email (to link accounts)
                        existingUser = await User.findOne({ email: email });

                        if (existingUser) {
                            console.log('✅ Linking Facebook to existing email account:', email);
                            // Link Facebook account to existing user
                            existingUser.facebookId = profile.id;
                            existingUser.avatar = existingUser.avatar || profile.photos?.[0]?.value;
                            if (existingUser.authProvider === 'local') {
                                existingUser.authProvider = 'multiple'; // Both email and Facebook
                            }
                            await existingUser.save();
                            return done(null, existingUser);
                        }
                    }

                    // Create new user - no existing user found
                    console.log('🆕 Creating new Facebook user for:', email);
                    const newUser = new User({
                        name: profile.displayName || 'Facebook User',
                        email: email,
                        facebookId: profile.id,
                        avatar: profile.photos?.[0]?.value,
                        authProvider: 'facebook',
                        // No password needed for Facebook OAuth users
                    });

                    const savedUser = await newUser.save();
                    console.log('✅ New Facebook user created successfully:', savedUser.email);

                    return done(null, savedUser);
                } catch (error) {
                    console.error('❌ Facebook OAuth error:', error);
                    return done(error, false);
                }
            }
        )
    );
} else {
    console.log('⚠️ Facebook OAuth not configured - missing environment variables');
}

export default passport;
