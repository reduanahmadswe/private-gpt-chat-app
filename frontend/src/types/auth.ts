export interface User {
    _id: string;
    id?: string;
    name: string;
    username?: string; // keeping for backwards compatibility
    email: string;
    avatar?: string;
    googleId?: string;
    authProvider?: 'local' | 'google';
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    message: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}
