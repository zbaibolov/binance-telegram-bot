import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { ConfigModule } from '../config/config.module';

@Module({
  providers: [BinanceService],
  imports: [ConfigModule],
  exports: [BinanceService],
})
export class BinanceModule {}
