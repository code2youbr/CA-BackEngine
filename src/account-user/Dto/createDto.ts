import { IsString, IsEmail, IsNotEmpty,  IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'


export class CreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
      required: true,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  cpfCnpj: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
  })
  email: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  telephone: string;

  @IsBoolean()
  @ApiProperty({
    required: true,
  })
  isLegalPerson: boolean
}