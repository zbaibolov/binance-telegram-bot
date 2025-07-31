import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('🚀 Binance Telegram Bot is starting...');
  console.log('📱 Bot will respond to commands in Telegram');
  console.log('🔗 Make sure to set up your environment variables');

  await app.listen(3000);
  console.log('✅ Bot is running on port 3000');
}
bootstrap();
