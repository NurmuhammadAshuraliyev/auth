import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { CreateRegisterDto } from './dto/create.register.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createRegisterDto: CreateRegisterDto) {
    const findEmail = await this.db.prisma.user.findUnique({
      where: { email: createRegisterDto.email },
    });

    if (findEmail) throw new ConflictException('This email exists.');

    const hashPassword = await bcrypt.hash(createRegisterDto.password, 12);

    const user = await this.db.prisma.user.create({
      data: {
        ...createRegisterDto,
        password: hashPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const token = await this.jwtService.signAsync({ userId: user.id });

    return { token, user };
  }

  async login(loginDto: loginDto) {
    const findEmail = await this.db.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!findEmail) throw new ConflictException('Email or password error');

    const comparePassword = await bcrypt.compare(
      loginDto.password,
      findEmail.password,
    );

    if (!comparePassword)
      throw new ConflictException('Email or password error');

    const token = await this.jwtService.signAsync({ userId: findEmail.id });

    const user = {
      id: findEmail.id,
      name: findEmail.name,
      email: findEmail.email,
    };

    return { token, user };
  }
}
