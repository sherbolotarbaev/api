import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @IsString({ message: 'Name must be a string.' })
  @MinLength(2, { message: 'Name must be at least 2 characters long.' })
  @MaxLength(64, { message: 'Name cannot be longer than 64 characters.' })
  name: string;

  @IsNotEmpty({ message: 'Surname cannot be empty.' })
  @IsString({ message: 'Surname must be a string.' })
  @MinLength(2, { message: 'Surname must be at least 2 characters long.' })
  @MaxLength(64, { message: 'Surname cannot be longer than 64 characters.' })
  surname: string;

  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Photo cannot be empty.' })
  @IsString({ message: 'Photo must be a string.' })
  photo?: string;
}
