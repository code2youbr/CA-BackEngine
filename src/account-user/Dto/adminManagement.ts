import { IsString, IsEmail, IsNotEmpty,  IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'


export class AdminManagement {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
  })
  currentAdminEmail: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
  })
  targetAdminEmail: string;

}