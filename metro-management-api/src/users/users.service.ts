import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.userRepo.find({
      order: { id: 'ASC' },
    });
  }

  async findById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async create(userData: Partial<User>) {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }

  async updateProfile(userId: number, data: UpdateProfileDto) {
    const user = await this.findById(userId);

    Object.assign(user, data);

    return this.userRepo.save(user);
  }

  async changePassword(userId: number, data: ChangePasswordDto) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matched = await bcrypt.compare(data.oldPassword, user.password);

    if (!matched) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    user.password = await bcrypt.hash(data.newPassword, 10);

    await this.userRepo.save(user);

    return {
      message: 'Password changed successfully',
    };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.userRepo.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = randomBytes(20).toString('hex');

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);

    user.resetToken = token;
    user.resetTokenExpiry = expiry;

    await this.userRepo.save(user);

    return {
      message: 'Password reset token generated successfully',
      resetToken: token,

    };
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.resetToken = :token', { token: data.token })
      .andWhere('user.resetTokenExpiry > :now', { now: new Date() })
      .getOne();

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(data.newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await this.userRepo.save(user);

    return {
      message: 'Password reset successfully',
    };
  }

 async updateUserByAdmin(id: number, data: Partial<User>) {
  const user = await this.findById(id);

  if (data.fullName !== undefined) {
    user.fullName = data.fullName;
  }

  if (data.phone !== undefined) {
    user.phone = data.phone;
  }

  if (data.role !== undefined) {
    user.role = data.role;
  }

  if (data.isActive !== undefined) {
    user.isActive = data.isActive;
  }

  await this.userRepo.save(user);

  return {
    message: 'User updated successfully',
    user,
  };
}

async deactivateUser(id: number) {
  const user = await this.findById(id);

  user.isActive = false;

  await this.userRepo.save(user);

  return {
    message: 'User deactivated successfully',
  };
}
}