import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;
}
