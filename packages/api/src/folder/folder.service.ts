import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Injectable()
export class FolderService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.folder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const folder = await this.prisma.folder.findFirst({
      where: { id, userId },
    });
    if (!folder) throw new NotFoundException('Pasta não encontrada');
    return folder;
  }

  async create(userId: string, dto: CreateFolderDto) {
    return this.prisma.folder.create({
      data: { name: dto.name, userId },
    });
  }

  async update(userId: string, id: string, dto: UpdateFolderDto) {
    // garante que existe
    await this.findOne(userId, id);
    return this.prisma.folder.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async remove(userId: string, id: string) {
    // garante que existe
    await this.findOne(userId, id);
    return this.prisma.folder.delete({ where: { id } });
  }
}
