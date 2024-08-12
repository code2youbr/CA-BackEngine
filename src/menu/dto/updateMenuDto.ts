import { IsString, IsEmail, IsNotEmpty, IsObject, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class UpdateMenuDto {
  @IsString()
  @ApiProperty({
    required: true,
  })
  name: string;

  @IsString()
  @ApiProperty({
    required: true,
  })
  newName: string;

  @IsString()
  @ApiProperty({
    required: true,
  })
  description: string;

  @IsString()
  @ApiProperty({
    required: true,
  })
  image: string;

  @IsNumber()
  @ApiProperty({
    required: true,
  })
  price: number

  @IsBoolean()
  @ApiProperty({
    default: true,
  })
  available: boolean

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  UserId: number

}