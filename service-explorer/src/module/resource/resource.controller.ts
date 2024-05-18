import {
  Res,
  Get,
  Put,
  Post,
  Body,
  Query,
  Delete,
  Header,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ParseCUIDPipe } from '@/pipe/parse-cuid.pipe';
import { ParseDatePipe } from '@/pipe/parse-date.pipe';
import { QueryListPipe } from './pipe/query-list.pipe';
import { ParseSortPipe } from '@/pipe/parse-sort.pipe';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadFileGuard } from '@/guard/upload-file.guard';
import { CurrentUser } from '@/decorator/current-user-user.decorator';
import { GetUploadFile } from '@/decorator/get-upload-file.decorator';

import { ResourceDTO } from '@/dto/resource.dto';
import { MoveResourcesDTO } from './dto/move-resources.dto';
import { InsertResourceDTO } from './dto/inset-resource.dto';
import { DeleteResourcesDTO } from './dto/delete-resources.dto';
import { FindResourcesAllDTO } from './dto/find-resources-all.dto';
import { FindResourcesListDTO } from './dto/find-resources-list.dto';

import type { FastifyReply } from 'fastify';
import type { MultipartFile } from '@fastify/multipart';

@ApiTags('资源管理')
@Controller('resource')
export class ResourceController {
  public constructor(private readonly ResourceService: ResourceService) {}

  @ApiOperation({
    summary: '全局资源搜索',
  })
  @Get()
  global(
    @Query(new ParseSortPipe(), new ParseDatePipe(['startTime', 'endTime']))
    query: FindResourcesAllDTO,
  ) {
    return query?.name ? this.ResourceService.findGlobal(query) : [];
  }

  @ApiOperation({
    summary: '获取全部文件夹',
  })
  @Get('folders')
  getList() {
    return this.ResourceService.findFolders();
  }

  @ApiOperation({
    summary: '获取文件夹下资源列表',
  })
  @Get('list')
  findList(
    @CurrentUser('id') userId: string,
    @Query(new QueryListPipe()) query: FindResourcesListDTO,
  ) {
    return this.ResourceService.findList(query, userId);
  }

  @ApiOperation({
    summary: '获取资源详情',
  })
  @Get('details')
  details(@Query('id', new ParseCUIDPipe()) id: string) {
    return this.ResourceService.getDetails(id);
  }

  @ApiOperation({
    summary: '创建文件夹',
  })
  @Post('create')
  create(@Body() body: InsertResourceDTO, @CurrentUser('id') id: string) {
    return this.ResourceService.createFolder(body, id);
  }

  @ApiOperation({
    summary: '编辑资源信息',
  })
  @Put('update')
  update(@Body() body: ResourceDTO, @CurrentUser('id') id: string) {
    return this.ResourceService.update(body, id);
  }

  @ApiOperation({
    summary: '移动资源位置',
  })
  @Put('move')
  move(@Body() body: MoveResourcesDTO) {
    return this.ResourceService.move(body);
  }

  @ApiOperation({
    summary: '删除资源',
    description: '若文件夹下有资源，则不能删除',
  })
  @Delete('delete')
  delete(@Body() body: DeleteResourcesDTO) {
    return this.ResourceService.delete(body);
  }

  @ApiOperation({
    summary: '上传资源',
    description: '分段式上传',
  })
  @Post('upload')
  @UseGuards(new UploadFileGuard())
  upload(@GetUploadFile() file: MultipartFile, @CurrentUser('id') id: string) {
    const fields = file.fields as Record<string, { value: string }>;
    return this.ResourceService.upload({
      creatorId: id,
      file: file.file,
      id: fields.id.value,
      name: fields.name.value,
      path: fields.path?.value,
      index: fields.index.value,
      total: fields.total.value,
      segment: fields.segment.value,
      size: Number(fields.size.value),
      parentId: fields.parentId?.value,
    });
  }

  @ApiOperation({
    summary: '下载资源文件',
  })
  @Get('download')
  @Header('Content-Disposition', 'attachment')
  async download(
    @Query('id') id: string,
    @Res() res: FastifyReply & { download: Function },
  ) {
    const { path, name } = await this.ResourceService.download(id);
    res.download(path, name, { cacheControl: false });
  }
}
