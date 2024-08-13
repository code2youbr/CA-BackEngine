import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
  })
  telephoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
  })
  email: string

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    required: false,
  })
  newEmail: string


}