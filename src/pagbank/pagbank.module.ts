import { Module } from '@nestjs/common';
import { PagbankService } from './pagbank.service';

@Module({
  providers: [PagbankService]
})
export class PagbankModule {}
