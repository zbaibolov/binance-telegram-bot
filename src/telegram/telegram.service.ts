import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { ConfigService } from '../config/config.service';
import { BinanceService } from '../binance/binance.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly bot: TelegramBot;
  private readonly chatId: string;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly binanceService: BinanceService,
  ) {
    this.bot = new TelegramBot(config.telegramToken, { polling: true });
    this.chatId = config.telegramChatId;
  }

  async onModuleInit() {
    this.setupBotCommands();
  }

  private setupBotCommands() {
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (!text) return;

      try {
        switch (text.toLowerCase()) {
          case '/start':
            await this.handleStartCommand(chatId);
            break;
          case '/balance':
            await this.handleBalanceCommand(chatId);
            break;
          case '/orders':
            await this.handleOrdersCommand(chatId);
            break;
          case '/help':
            await this.handleHelpCommand(chatId);
            break;
          default:
            await this.bot.sendMessage(
              chatId,
              'Unknown command. Use /help to see available commands.',
            );
        }
      } catch (error) {
        this.logger.error('Error handling bot command', error);
        await this.bot.sendMessage(
          chatId,
          '❌ An error occurred while processing your request.',
        );
      }
    });

    this.bot.on('error', (error) => {
      this.logger.error('Telegram bot error', error);
    });
  }

  private async handleStartCommand(chatId: number) {
    const message = `
🚀 Welcome to Binance Telegram Bot!

Available commands:
/balance - Get wallet balance
/orders - Get open orders
/help - Show this help message

Your bot is now connected to Binance! 📈
    `;
    await this.bot.sendMessage(chatId, message);
  }

  private async handleBalanceCommand(chatId: number) {
    try {
      const balances = await this.binanceService.getWalletBalance();

      if (balances.length === 0) {
        await this.bot.sendMessage(
          chatId,
          '💰 No balances found in your wallet.',
        );
        return;
      }

      let message = '💰 Wallet Balance:\n\n';
      balances.forEach((balance) => {
        const free = parseFloat(balance.free);
        const locked = parseFloat(balance.locked);
        const total = free + locked;

        if (total > 0) {
          message += `${balance.asset}:\n`;
          message += `  Free: ${free.toFixed(8)}\n`;
          message += `  Locked: ${locked.toFixed(8)}\n`;
          message += `  Total: ${total.toFixed(8)}\n\n`;
        }
      });

      await this.bot.sendMessage(chatId, message);
    } catch (error) {
      this.logger.error('Error getting balance', error);
      await this.bot.sendMessage(
        chatId,
        '❌ Failed to get wallet balance. Please check your API credentials.',
      );
    }
  }

  private async handleOrdersCommand(chatId: number) {
    try {
      const orders = await this.binanceService.getOpenOrders();

      if (orders.length === 0) {
        await this.bot.sendMessage(chatId, '📋 No open orders found.');
        return;
      }

      let message = '📋 Open Orders:\n\n';
      orders.forEach((order) => {
        message += `${order.symbol} ${order.side}\n`;
        message += `  Price: ${order.price}\n`;
        message += `  Quantity: ${order.origQty}\n`;
        message += `  Status: ${order.status}\n`;
        message += `  Type: ${order.type}\n\n`;
      });

      await this.bot.sendMessage(chatId, message);
    } catch (error) {
      this.logger.error('Error getting orders', error);
      await this.bot.sendMessage(
        chatId,
        '❌ Failed to get open orders. Please check your API credentials.',
      );
    }
  }

  private async handleHelpCommand(chatId: number) {
    const message = `
🤖 Binance Telegram Bot Help

Available commands:
/start - Start the bot and see welcome message
/balance - Get your wallet balance
/orders - Get your open orders
/help - Show this help message

The bot connects to your Binance account and provides real-time information about your trading activities.
    `;
    await this.bot.sendMessage(chatId, message);
  }

  async sendMessage(message: string): Promise<void> {
    try {
      await this.bot.sendMessage(this.chatId, message);
      this.logger.log(`Message sent: ${message}`);
    } catch (error) {
      this.logger.error('Failed to send message to Telegram', error);
    }
  }

  async sendNotification(message: string): Promise<void> {
    await this.sendMessage(`🔔 Notification: ${message}`);
  }
}
