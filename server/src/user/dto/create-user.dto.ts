import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Full name must be a string' })
  @MinLength(3, {
    message: 'Full name must be at least 3 characters long',
  })
  fullName: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password: string;

  @IsString({ message: 'Role ID must be a string' })
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'Role ID must be a valid ObjectId',
  })
  roleId: string;

  @IsOptional()
  lastLogin?: Date;
}
