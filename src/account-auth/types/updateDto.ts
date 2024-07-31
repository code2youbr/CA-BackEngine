import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto{
  @IsString()
  @IsEmail()
  @ApiProperty({
    required: true,
  })
  email: string;
}