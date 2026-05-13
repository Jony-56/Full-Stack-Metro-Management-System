import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private getUserFromToken(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.replace('Bearer ', '');
    return this.jwtService.verify(token);
  }

  private checkAdmin(authHeader: string) {
    const user = this.getUserFromToken(authHeader);

    if (user.role !== 'admin') {
      throw new UnauthorizedException('Only admin can perform this action');
    }

    return user;
  }

  @Get()
  findAll(@Headers('authorization') authHeader: string) {
    this.checkAdmin(authHeader);
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkAdmin(authHeader);
    return this.usersService.findById(Number(id));
  }

  @Patch('me')
  updateProfile(
    @Body() body: UpdateProfileDto,
    @Headers('authorization') authHeader: string,
  ) {
    const user = this.getUserFromToken(authHeader);
    return this.usersService.updateProfile(user.id, body);
  }

  @Patch('change-password')
  changePassword(
    @Body() body: ChangePasswordDto,
    @Headers('authorization') authHeader: string,
  ) {
    const user = this.getUserFromToken(authHeader);
    return this.usersService.changePassword(user.id, body);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.usersService.forgotPassword(body);
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.usersService.resetPassword(body);
  }

  @Delete(':id')
  deactivateUser(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    this.checkAdmin(authHeader);
    return this.usersService.deactivateUser(Number(id));
  }
}