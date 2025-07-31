import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { TelegramModule } from './telegram/telegram.module';
import { BinanceModule } from './binance/binance.module';

@Module({
  imports: [ConfigModule, TelegramModule, BinanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
