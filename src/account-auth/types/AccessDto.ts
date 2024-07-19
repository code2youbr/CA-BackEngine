import { IsString, IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Optional } from '@nestjs/common';


export class AccessDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  identifier: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  password: string;

}