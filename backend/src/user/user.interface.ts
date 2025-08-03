export interface IUser {
  _id?: string;
  id?: string; // Alias for _id for easier access
  name: string;
  email: string;
  password?: string; // Optional for OAuth users
  googleId?: string; // Google OAuth ID
  facebookId?: string; // Facebook OAuth ID
  avatar?: string; // Profile picture URL
  refreshToken?: string; // Store refresh token
  authProvider: 'local' | 'google' | 'facebook' | 'multiple'; // Authentication provider
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
}

export interface IPasswordUpdate {
  currentPassword: string;
  newPassword: string;
}
