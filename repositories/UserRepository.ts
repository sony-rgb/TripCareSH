import { IUserRepository } from './interfaces/IUserRepository';
import { Q } from '@nozbe/watermelondb';
import database from '../database/init';
import User from '../database/model/User';

export default class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      console.log('🔍 [UserRepository.findById] Looking for user with ID:', id);
      // Use .find() to query by primary key (id)
      const user = await database.get<User>('users').find(id);
      console.log('✅ [UserRepository.findById] User found:', user.id);
      return user;
    } catch (error) {
      // .find() throws if not found, so catch and return null
      console.log('ℹ️ [UserRepository.findById] User not found with ID:', id);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await database.get<User>('users').query(Q.where('email', email)).fetch();
    return users.length > 0 ? users[0] : null;
  }

  async findCurrentUser(): Promise<User | null> {
    // Since we only store the current logged-in user, we can just get the first user
    const users = await database.get<User>('users').query().fetch();
    return users.length > 0 ? users[0] : null;
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      console.log('🆕 [UserRepository.create] Creating user with data:', {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        homeCityId: userData.homeCityId
      });
      
      const userCollection = database.get<User>('users');
      const newUser = await database.write(async () => {
        const user = await userCollection.create(u => {
          // Watermelon requires setting id via _raw to override generated IDs
          if (userData.id) {
            console.log('🔑 [UserRepository.create] Setting custom ID:', userData.id);
            (u as any)._raw.id = userData.id;
          }
          // Manually assign fields (can't use Object.assign with id property)
          if (userData.email) u.email = userData.email;
          if (userData.name) u.name = userData.name;
          if (userData.homeCityId) u.homeCityId = userData.homeCityId;
          if (userData.homeCityName !== undefined) u.homeCityName = userData.homeCityName;
          if (userData.updatedAtUtc) {
            u.updatedAtUtc = userData.updatedAtUtc;
          } else {
            u.updatedAtUtc = new Date();
          }
        });
        
        console.log('✅ [UserRepository.create] User created successfully:', {
          id: user.id,
          email: user.email,
          name: user.name
        });
        
        return user;
      });
      
      // Verify the user was actually created
      const verification = await this.findById(newUser.id);
      if (verification) {
        console.log('✅ [UserRepository.create] User verified in database:', verification.id);
      } else {
        console.error('❌ [UserRepository.create] User NOT found after creation!');
      }
      
      return newUser;
    } catch (error) {
      console.error('❌ [UserRepository.create] Error creating user:', error);
      console.error('❌ [UserRepository.create] User data that failed:', userData);
      throw error;
    }
  }

  async update(user: User, userData: Partial<User>): Promise<User> {
    try {
      console.log('🔄 [UserRepository.update] Updating user:', {
        id: user.id,
        email: userData.email || user.email
      });
      
      await database.write(async () => {
        await user.update(u => {
          if (userData.email) u.email = userData.email;
          if (userData.name) u.name = userData.name;
          if (userData.homeCityId) u.homeCityId = userData.homeCityId;
          if (userData.homeCityName !== undefined) u.homeCityName = userData.homeCityName;
          if (userData.updatedAtUtc) {
            u.updatedAtUtc = userData.updatedAtUtc;
          } else {
            u.updatedAtUtc = new Date();
          }
        });
      });

      const updatedUser = await this.findById(user.id);
      if (!updatedUser) {
        console.error('❌ [UserRepository.update] User not found after update:', user.id);
        throw new Error("User not found after update");
      }

      console.log('✅ [UserRepository.update] User updated successfully:', updatedUser.id);
      return updatedUser;
    } catch (error) {
      console.error('❌ [UserRepository.update] Error updating user:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await database.write(async () => {
      const user = await this.findById(id);
      if (user) {
        await user.markAsDeleted();
      }
    });
  }
}

