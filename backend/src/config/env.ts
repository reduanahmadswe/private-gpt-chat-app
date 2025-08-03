import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    NODE_ENV: 'development' | 'production';
    PORT: string;

    MONGO_URI: string;

    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;

    OPENROUTER_API_KEY: string;
    OPENAI_API_BASE_URL: string;

    CLIENT_URL: string;
    FRONTEND_URL: string;

    // Google OAuth
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    SESSION_SECRET: string;

    // Facebook OAuth
    FACEBOOK_CLIENT_ID?: string;
    FACEBOOK_CLIENT_SECRET?: string;
    FACEBOOK_CALLBACK_URL?: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = [
        'NODE_ENV',
        'PORT',
        'MONGO_URI',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
        'OPENROUTER_API_KEY',
        'OPENAI_API_BASE_URL',
        'CLIENT_URL',
        'FRONTEND_URL',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GOOGLE_CALLBACK_URL',
        'SESSION_SECRET',
        // Facebook OAuth variables are optional for now
    ];

    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`❌ Missing required environment variable: ${key}`);
        }
    });

    return {
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
        PORT: process.env.PORT as string,

        MONGO_URI: process.env.MONGO_URI as string,

        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,

        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY as string,
        OPENAI_API_BASE_URL: process.env.OPENAI_API_BASE_URL as string,

        CLIENT_URL: process.env.CLIENT_URL as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,

        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        SESSION_SECRET: process.env.SESSION_SECRET as string,

        FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
        FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
        FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,
    };
};

export const envVars = loadEnvVariables();
