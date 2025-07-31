import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get binanceApiKey(): string {
    return this.configService.get<string>('BINANCE_API_KEY');
  }

  get binanceApiSecret(): string {
    return this.configService.get<string>('BINANCE_API_SECRET');
  }

  get telegramToken(): string {
    return this.configService.get<string>('TELEGRAM_BOT_TOKEN');
  }

  get telegramChatId(): string {
    return this.configService.get<string>('TELEGRAM_CHAT_ID');
  }
}
