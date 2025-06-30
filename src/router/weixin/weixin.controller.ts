import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WeixinService } from './weixin.service';
import { CreateWeixinDto } from './dto/create-weixin.dto';
import { UpdateWeixinDto } from './dto/update-weixin.dto';

@Controller('weixin')
export class WeixinController {
  constructor(private readonly weixinService: WeixinService) {}

  @Post()
  create(@Body() createWeixinDto: CreateWeixinDto) {
    return this.weixinService.create(createWeixinDto);
  }

  @Get()
  findAll() {
    return this.weixinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weixinService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeixinDto: UpdateWeixinDto) {
    return this.weixinService.update(+id, updateWeixinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weixinService.remove(+id);
  }
}
