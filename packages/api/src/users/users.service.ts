import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface UserEntity {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findOrCreateByGoogle(
    email: string,
    name?: string,
    image?: string,
  ): Promise<UserEntity> {
    return this.prisma.user.upsert({
      where: { email },
      update: { name, image },
      create: { email, name, image },
      select: { id: true, email: true, name: true, image: true },
    });
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, image: true },
    });
  }
}
