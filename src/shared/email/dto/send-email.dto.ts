import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum ContentType {
  TEXT = 'text',
  HTML = 'html',
}

export class SendEmailDto {
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;

  @IsNotEmpty({ message: 'Content cannot be empty.' })
  @IsString({ message: 'Content must be a string.' })
  content: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Subject cannot be empty.' })
  @IsString({ message: 'Subject must be a string.' })
  subject?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Type cannot be empty.' })
  @IsEnum(ContentType, { message: 'Invalid type.' })
  type?: ContentType = ContentType.TEXT;
}
