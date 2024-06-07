import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginOtpDto {
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;

  @IsNotEmpty({ message: 'OTP cannot be empty.' })
  @IsString({ message: 'OTP must be a string.' })
  otp: string;
}
