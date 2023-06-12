import { ResourcesService } from './resources.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserID } from '@/decorator/user-id.decorator';
import { UploadFileGuard } from '@/guard/upload-file.guard';
import { GetUploadFile } from '@/decorator/get-upload-file.decorator';
import { Body, Get, Post, Query, Controller, UseGuards } from '@nestjs/common';

import { ResourceDTO } from '@/dto/resource.dto';
import { DeleteResourcesDTO } from './dto/delete-resources.dto';
import { FindResourcesListDTO } from './dto/find-resources-list.dto';

import type { MultipartFile } from '@fastify/multipart';

@ApiTags('资源管理')
@Controller('resource')
export class ResourcesController {
  public constructor(private readonly ResourcesService: ResourcesService) {}

  @ApiOperation({
    summary: '获取全部文件夹',
  })
  @Get('folders')
  getList() {
    return this.ResourcesService.findFolders();
  }

  @ApiOperation({
    summary: '获取文件夹下资源列表',
  })
  @Get('list')
  findList(@Query() query: FindResourcesListDTO) {
    return this.ResourcesService.findList(query.id);
  }

  @ApiOperation({
    summary: '创建文件夹',
  })
  @Post('create')
  create(@Body() body: ResourceDTO, @UserID() id: string) {
    return this.ResourcesService.createFolder(body, id);
  }

  @ApiOperation({
    summary: '编辑资源信息',
  })
  @Post('update')
  update(@Body() body: ResourceDTO) {
    return this.ResourcesService.update(body);
  }

  @ApiOperation({
    summary: '删除资源',
    description: '若文件夹下有资源，则不能删除',
  })
  @Post('delete')
  delete(@Body() body: DeleteResourcesDTO) {
    return this.ResourcesService.delete(body);
  }

  @ApiOperation({
    summary: '上传资源',
    description: '分段式上传',
  })
  @Post('upload')
  @UseGuards(new UploadFileGuard())
  upload(@GetUploadFile() file: MultipartFile, @UserID() id: string) {
    const fields = file.fields as Record<string, { value: string }>;
    return this.ResourcesService.upload({
      creatorId: id,
      file: file.file,
      id: fields.id.value,
      name: fields.name.value,
      index: fields.index.value,
      total: fields.total.value,
      segment: fields.segment.value,
      parentId: fields.parentId.value,
      size: Number(fields.size.value),
    });
  }
}
