# Binance Telegram Bot

A NestJS-based Telegram bot that connects to Binance API to provide real-time wallet balance, order information, and trading notifications.

## Features

- 🤖 **Telegram Bot Integration** - Interactive bot with commands
- 💰 **Wallet Balance** - Get real-time wallet balances
- 📋 **Order Management** - View open orders and order history
- 🔔 **Real-time Notifications** - WebSocket connection for live updates
- 🔐 **Secure API Integration** - HMAC signature authentication with Binance

## Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm
- Binance API credentials
- Telegram Bot Token

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Fill in your credentials:

```env
# Binance API Configuration
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_API_SECRET=your_binance_api_secret_here

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here

# Optional: Environment
NODE_ENV=development
```

### 3. Get Binance API Credentials

1. Log in to your Binance account
2. Go to API Management
3. Create a new API key
4. Enable "Enable Spot & Margin Trading" and "Enable Reading"
5. Copy the API Key and Secret Key

### 4. Create Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token

### 5. Get Your Chat ID

1. Start a conversation with your bot
2. Send any message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find your `chat_id` in the response

## Running the Bot

### Development Mode

```bash
pnpm run start:dev
```

### Production Mode

```bash
pnpm run build
pnpm run start:prod
```

## Bot Commands

Once the bot is running, you can use these commands in Telegram:

- `/start` - Start the bot and see welcome message
- `/balance` - Get your wallet balance
- `/orders` - Get your open orders
- `/help` - Show help message

## Project Structure

```
src/
├── binance/           # Binance API integration
│   ├── binance.module.ts
│   └── binance.service.ts
├── config/            # Configuration management
│   ├── config.module.ts
│   └── config.service.ts
├── telegram/          # Telegram bot integration
│   ├── telegram.module.ts
│   └── telegram.service.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## API Endpoints

The bot also exposes HTTP endpoints:

- `GET /` - Health check

## Security Considerations

- Never commit your `.env` file to version control
- Use environment-specific API keys
- Regularly rotate your API credentials
- Monitor your bot's activity

## Error Handling

The bot includes comprehensive error handling:

- API credential validation
- Network error recovery
- WebSocket reconnection logic
- User-friendly error messages

## Development

### Running Tests

```bash
# Unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

### Code Formatting

```bash
pnpm run format
```

### Linting

```bash
pnpm run lint
```

## Troubleshooting

### Common Issues

1. **"Binance API credentials are missing"**
   - Check your `.env` file
   - Ensure variables are properly set

2. **"Failed to get wallet balance"**
   - Verify your Binance API permissions
   - Check if API key has reading permissions

3. **Bot not responding**
   - Verify Telegram bot token
   - Check if bot is running
   - Ensure chat ID is correct

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
