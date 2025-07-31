import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ConfigModule } from '../config/config.module';
import { BinanceModule } from '../binance/binance.module';

@Module({
  imports: [ConfigModule, BinanceModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
