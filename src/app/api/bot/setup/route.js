import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(botToken);

// ✅ Change this to your Vercel domain
const WEBHOOK_URL = `https://tap-coin-rfm-bot.vercel.app/api/bot/webhook`;

// ✅ Telegram Mini App link
const WEB_APP_URL = 'https://t.me/TapcoinRMFBOT/tapcoin';

export async function GET() {
  if (!botToken) {
    return NextResponse.json({ status: 500, message: 'Bot Token not found' });
  }

  try {
    // 1️⃣ Set Webhook
    await bot.telegram.setWebhook(WEBHOOK_URL);

    // 2️⃣ Set Menu Button (WebApp)
    await bot.telegram.setChatMenuButton({
      menu_button: {
        type: 'web_app',
        text: '🔥 Play',
        web_app: { url: WEB_APP_URL },
      },
    });

    // 3️⃣ Set Commands
    await bot.telegram.setMyCommands([
      { command: 'start', description: '🚀 Start your TapCoin journey' },
      { command: 'help', description: 'ℹ️ Get help & official channel' },
    ]);

    return NextResponse.json({
      status: 200,
      message: '✅ Bot setup successful!',
      webhook: WEBHOOK_URL,
      menuButton: 'Set to WebApp',
    });
  } catch (error) {
    console.error('Error setting up bot:', error);
    return NextResponse.json({
      status: 500,
      message: 'Setup Failed',
      error: error.message,
    });
  }
}
