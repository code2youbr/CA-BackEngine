import { IsString, IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'


export class AccessDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  password: string;

}