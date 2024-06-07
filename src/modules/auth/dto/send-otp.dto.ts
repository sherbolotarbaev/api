import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;
}
