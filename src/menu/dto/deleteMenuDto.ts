import { IsString, IsEmail, IsNotEmpty, IsObject, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class deleteMenuDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  UserId: number

}