import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
  ) {}
  async register(registerDto: RegisterDto) {
    const user = await this.userService.findOneByEmail(
      registerDto.email.toLocaleLowerCase().trim(),
    );

    if (user) {
      console.error('User already exists:', user);
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcryptjs.hash(registerDto.password, 10);
    const userRole = await this.roleService.findOneByName('user');
    const createUserDto: CreateUserDto = {
      ...registerDto,
      password: hashedPassword,
      roleId: userRole.id,
    };
    return await this.userService.create(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcryptjs.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      console.error('Invalid password for user:', user.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const role = await this.roleService.findOneById(user.roleId);

    if (!role) {
      console.error('Role not found for user:', user);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, role: role.name };
    const token = this.jwtService.sign(payload);
    return {
      token: token,
      email: loginDto.email,
    };
  }
}
