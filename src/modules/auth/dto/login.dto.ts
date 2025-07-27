import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class loginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
