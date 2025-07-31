import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import { ConfigService as NestConfigService } from '@nestjs/config';

describe('ConfigService', () => {
  let service: ConfigService;
  let nestConfigService: NestConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: NestConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
    nestConfigService = module.get<NestConfigService>(NestConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return binance API key', () => {
    const mockApiKey = 'test-api-key';
    jest.spyOn(nestConfigService, 'get').mockReturnValue(mockApiKey);

    expect(service.binanceApiKey).toBe(mockApiKey);
    expect(nestConfigService.get).toHaveBeenCalledWith('BINANCE_API_KEY');
  });

  it('should return binance API secret', () => {
    const mockApiSecret = 'test-api-secret';
    jest.spyOn(nestConfigService, 'get').mockReturnValue(mockApiSecret);

    expect(service.binanceApiSecret).toBe(mockApiSecret);
    expect(nestConfigService.get).toHaveBeenCalledWith('BINANCE_API_SECRET');
  });

  it('should return telegram bot token', () => {
    const mockToken = 'test-telegram-token';
    jest.spyOn(nestConfigService, 'get').mockReturnValue(mockToken);

    expect(service.telegramToken).toBe(mockToken);
    expect(nestConfigService.get).toHaveBeenCalledWith('TELEGRAM_BOT_TOKEN');
  });

  it('should return telegram chat ID', () => {
    const mockChatId = '123456789';
    jest.spyOn(nestConfigService, 'get').mockReturnValue(mockChatId);

    expect(service.telegramChatId).toBe(mockChatId);
    expect(nestConfigService.get).toHaveBeenCalledWith('TELEGRAM_CHAT_ID');
  });
});
