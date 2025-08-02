export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
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
