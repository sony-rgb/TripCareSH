import { User } from "../../models/User";
import UserModel from "../../database/model/User";

export interface IUserService {
    registerUser(name: string, email: string, password: string, passwordRequirementsMessage: string): Promise<User>;
    resetPassword(email: string): Promise<boolean>;
    fetchAndStoreUserProfile(): Promise<UserModel | null>;
    getCurrentUser(): Promise<UserModel | null>;
}