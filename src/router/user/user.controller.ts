import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { loginUserDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Public } from '@decorators';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: '用户登录', description: '通过用户名/邮箱/手机号登录系统' })
  @Public()
  @Post('login')
  login(@Body() loginUserDto: loginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiOperation({ summary: '创建用户', description: '' })
  @Public()
  @Post('createUser')
  create(@Body() aa) {
    return this.userService.create(aa);
  }
  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
