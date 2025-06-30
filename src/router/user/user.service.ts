import { Injectable } from '@nestjs/common';
import { loginUserDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtService } from '@/components/jwt/jwt.service';
import { MongodbService } from '@/components/sql/mongodb/mongodb.service';
@Injectable()
export class UserService {
  private readonly collection = 'users'; // 固定表名！
  constructor(private readonly JwtService: JwtService, private readonly MongodbService: MongodbService) { }

  async create(createUserDto: CreateUserDto) {
    const result = await this.MongodbService.create(this.collection, createUserDto)
    return result;
  }

  async login(loginUserDto: loginUserDto) {
    const token = await this.JwtService.createToken(loginUserDto)
    return token;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
