import { IsNotEmpty, IsString } from 'class-validator';

export class GetLocationDto {
  @IsNotEmpty({ message: 'IP cannot be empty.' })
  @IsString({ message: 'IP must be a string.' })
  ip: string;
}
