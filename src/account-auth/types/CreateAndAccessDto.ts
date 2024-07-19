import { IsString, IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'


export class CreateAndAccessDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
      required: true,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  password: string;
}