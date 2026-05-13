import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

 async findByEmail(email: string) {
  return this.userRepo
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', { email })
    .getOne();
}

  findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  create(userData: Partial<User>) {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }
}