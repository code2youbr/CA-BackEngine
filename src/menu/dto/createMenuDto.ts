import { IsString, IsEmail, IsNotEmpty, IsObject, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  name: string;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    required: true,
  })
  description: {
    description: string;
    image: string;
  };

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  price: number

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    default: true,
  })
  available: boolean
}