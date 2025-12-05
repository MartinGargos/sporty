import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(email: string, password: string, name: string, location: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = this.usersRepository.create({
      email,
      passwordHash,
      name,
      location,
      language: 'cs',
      noShows: 0,
    });

    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async incrementNoShows(userId: string): Promise<void> {
    await this.usersRepository.increment({ id: userId }, 'noShows', 1);
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updates);
    return this.usersRepository.save(user);
  }
}


