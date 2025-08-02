import passport from 'passport';
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

export default passport;
