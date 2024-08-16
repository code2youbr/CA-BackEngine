import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PagbankService } from './pagbank.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          baseURL: configService.get<string>('pagBank.baseUrl'),
          validateStatus: (status: number) => status < 500,
          headers: {
            Authorization: configService.get<string>('pagBank.apiKey'),
          }
        }
      }
    })
  ],
  providers: [PagbankService],
  exports: [PagbankService]
})
export class PagbankModule {}
