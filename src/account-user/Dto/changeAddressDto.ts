import { IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
import { Address } from '../interface/address';


export class ChangeAddressDto {

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    required: true,
  })
  address: Address;
}