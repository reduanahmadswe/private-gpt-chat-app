import { User } from './user.model';
import { IUserUpdate, IPasswordUpdate } from './user.interface';
import { createError } from '../shared/middleware/errorHandler';

export class UserService {
  async getUserProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw createError('User not found', 404);
    }
    return user;
  }

  async updateProfile(userId: string, data: IUserUpdate) {
    const { name, email } = data;
    
    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        throw createError('Email already in use', 400);
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { ...(name && { name }), ...(email && { email }) },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw createError('User not found', 404);
    }

    return user;
  }

  async updatePassword(userId: string, data: IPasswordUpdate) {
    const { currentPassword, newPassword } = data;

    // Find user with password field
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw createError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw createError('Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  async deleteAccount(userId: string) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw createError('User not found', 404);
    }
    
    // TODO: Also delete all user's chats
    return { message: 'Account deleted successfully' };
  }
}
