import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, folderId?: string) {
    return this.prisma.document.findMany({
      where: { userId, folderId: folderId || undefined },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id, userId },
    });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    return doc;
  }

  async upload(
    userId: string,
    file: Express.Multer.File,
    dto: CreateDocumentDto,
  ) {
    // file.path: local onde salvamos; aqui usamos URL relativa
    return this.prisma.document.create({
      data: {
        title: dto.title,
        mimeType: file.mimetype,
        size: file.size,
        url: file.filename, // ajuste se for servir estático
        userId,
        folderId: dto.folderId,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateDocumentDto) {
    await this.findOne(userId, id);
    return this.prisma.document.update({
      where: { id },
      data: { title: dto.title, folderId: dto.folderId },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.document.delete({ where: { id } });
  }
}
