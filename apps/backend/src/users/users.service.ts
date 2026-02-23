import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findOrCreateByGoogle(googleId: string, email: string, name: string): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { googleId },
    });
    if (existing) return existing;
    return this.prisma.user.create({
      data: { googleId, email, name, role: 'user' },
    });
  }
}
