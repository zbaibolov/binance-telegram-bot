// src/binance/binance.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import axios from 'axios';
import WebSocket from 'ws';
import * as crypto from 'crypto';

interface BinanceBalance {
  asset: string;
  free: string;
  locked: string;
}

interface BinanceOrder {
  symbol: string;
  orderId: number;
  price: string;
  origQty: string;
  executedQty: string;
  status: string;
  type: string;
  side: string;
  time: number;
}

@Injectable()
export class BinanceService implements OnModuleInit {
  private readonly logger = new Logger(BinanceService.name);
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly baseUrl = 'https://api.binance.com';
  private listenKey: string;
  private ws: WebSocket;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.binanceApiKey;
    this.apiSecret = this.configService.binanceApiSecret;

    this.logger.log('Binance API Key loaded:', this.apiKey ? 'Yes' : 'No');
    this.logger.log(
      'Binance API Secret loaded:',
      this.apiSecret ? 'Yes' : 'No',
    );

    if (!this.apiKey || !this.apiSecret) {
      this.logger.error(
        'Binance API credentials are missing. Please check your environment variables.',
      );
    }
  }

  async onModuleInit() {
    if (this.apiKey && this.apiSecret) {
      this.logger.log('Binance service initialized successfully');
      // User stream disabled due to API limitations
      // Bot will work without real-time notifications
    }
  }

  async getAccountInfo() {
    try {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      const signature = this.generateSignature(queryString);

      const response = await axios.get(`${this.baseUrl}/api/v3/account`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
        params: {
          timestamp,
          signature,
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get account info', error);
      throw error;
    }
  }

  async getWalletBalance(): Promise<BinanceBalance[]> {
    try {
      const accountInfo = await this.getAccountInfo();
      return accountInfo.balances.filter(
        (balance) =>
          parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0,
      );
    } catch (error) {
      this.logger.error('Failed to get wallet balance', error);
      throw error;
    }
  }

  async getOpenOrders(symbol?: string): Promise<BinanceOrder[]> {
    try {
      const timestamp = Date.now();
      const params: any = { timestamp };

      if (symbol) {
        params.symbol = symbol;
      }

      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const signature = this.generateSignature(queryString);

      const response = await axios.get(`${this.baseUrl}/api/v3/openOrders`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
        params: {
          ...params,
          signature,
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get open orders', error);
      throw error;
    }
  }

  async getOrderHistory(
    symbol?: string,
    limit: number = 10,
  ): Promise<BinanceOrder[]> {
    try {
      const timestamp = Date.now();
      const params: any = { timestamp, limit };

      if (symbol) {
        params.symbol = symbol;
      }

      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      const signature = this.generateSignature(queryString);

      const response = await axios.get(`${this.baseUrl}/api/v3/myTrades`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
        params: {
          ...params,
          signature,
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get order history', error);
      throw error;
    }
  }

  private generateSignature(queryString: string): string {
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(queryString)
      .digest('hex');
  }

  private async initUserStream() {
    try {
      this.logger.log(
        'Initializing user stream with API key:',
        this.apiKey ? 'Present' : 'Missing',
      );

      // Try the correct endpoint for user data stream
      const res = await axios.post(
        `${this.baseUrl}/api/v3/userDataStream`,
        null,
        {
          headers: {
            'X-MBX-APIKEY': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      this.listenKey = res.data.listenKey;
      this.logger.log(`Received listenKey: ${this.listenKey}`);

      this.connectWebSocket();
    } catch (error) {
      this.logger.error('Failed to initialize user stream', error);
      if (error.response) {
        this.logger.error('Response status:', error.response.status);
        this.logger.error('Response data:', error.response.data);
      }
      // Don't throw the error, just log it
    }
  }

  private connectWebSocket() {
    if (!this.listenKey) {
      this.logger.error('No listenKey available for WebSocket connection');
      return;
    }

    this.ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${this.listenKey}`,
    );
    this.logger.log('WebSocket connection opened');

    this.ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());

        if (parsed.e === 'executionReport') {
          const {
            s: symbol,
            S: side,
            X: status,
            q: quantity,
            p: price,
          } = parsed;

          if (status === 'FILLED') {
            this.logger.log(
              `✅ Order FILLED: ${side} ${symbol} ${quantity} @ ${price}`,
            );
            // TODO: Integrate with Telegram notification
          }
        }
      } catch (error) {
        this.logger.error('Error parsing WebSocket message', error);
      }
    });

    this.ws.on('error', (err) => {
      this.logger.error('WebSocket error', err);
    });

    this.ws.on('close', () => {
      this.logger.warn('WebSocket closed. Reconnecting...');
      setTimeout(() => this.connectWebSocket(), 5000);
    });
  }

  async closeWebSocket() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
