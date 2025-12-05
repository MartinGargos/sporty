import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from './entities/sport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  exports: [TypeOrmModule],
})
export class SportsModule {}


