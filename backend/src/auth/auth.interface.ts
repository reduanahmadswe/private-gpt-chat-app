export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  refreshToken: string;
  tokenExpiry?: Date;
  refreshTokenExpiry?: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    authProvider: 'local' | 'google' | 'facebook' | 'multiple';
  };
}

export interface IJWTPayload {
  userId: string;
  email: string;
}

export interface IGoogleOAuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    authProvider: 'google';
  };
}

export interface IFacebookOAuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    authProvider: 'facebook';
  };
}
