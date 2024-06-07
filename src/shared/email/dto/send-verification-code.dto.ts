import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendVerificationCodeDto {
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;

  @IsNotEmpty({ message: 'Code cannot be empty.' })
  @IsString({ message: 'Code must be a string.' })
  code: string;
}
