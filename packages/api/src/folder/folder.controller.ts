import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.folderService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.folderService.findOne(req.user.id, id);
  }

  @Post()
  create(@Request() req: RequestWithUser, @Body() dto: CreateFolderDto) {
    return this.folderService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateFolderDto,
  ) {
    return this.folderService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.folderService.remove(req.user.id, id);
  }
}
