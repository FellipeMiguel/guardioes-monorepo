import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const name = `${Date.now()}${extname(file.originalname)}`;
      cb(null, name);
    },
  }),
};

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly docService: DocumentService) {}

  @Get()
  findAll(
    @Request() req: RequestWithUser,
    @Body('folderId') folderId?: string,
  ) {
    return this.docService.findAll(req.user.id, folderId);
  }

  @Get(':id')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.docService.findOne(req.user.id, id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  upload(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.docService.upload(req.user.id, file, dto);
  }

  @Patch(':id')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.docService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.docService.remove(req.user.id, id);
  }
}
