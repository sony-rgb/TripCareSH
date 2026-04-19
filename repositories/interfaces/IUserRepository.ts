import User from '../../database/model/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findCurrentUser(): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
  update(user: User, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

