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
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    authProvider: 'local' | 'google';
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
