import { IUser } from '../user/user.interface';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            cookies?: Record<string, string>;
        }
    }
}

export { };

