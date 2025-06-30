import { Injectable } from '@nestjs/common';
import { CreateWeixinDto } from './dto/create-weixin.dto';
import { UpdateWeixinDto } from './dto/update-weixin.dto';

@Injectable()
export class WeixinService {
  create(createWeixinDto: CreateWeixinDto) {
    return 'This action adds a new weixin';
  }

  findAll() {
    return `This action returns all weixin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} weixin`;
  }

  update(id: number, updateWeixinDto: UpdateWeixinDto) {
    return `This action updates a #${id} weixin`;
  }

  remove(id: number) {
    return `This action removes a #${id} weixin`;
  }
}
