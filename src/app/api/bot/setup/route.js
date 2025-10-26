import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(botToken);

// ✅ Your webhook URL
const WEBHOOK_URL = `https://tap-coin-rfm-bot.vercel.app/api/bot/webhook`;

export async function GET() {
  if (!botToken) {
    return NextResponse.json({ status: 500, message: 'Bot Token not found' });
  }

  try {
    // 1️⃣ Set Webhook
    await bot.telegram.setWebhook(WEBHOOK_URL);

    // 2️⃣ Only set commands (keep menu as is)
    await bot.telegram.setMyCommands([
      { command: 'start', description: '🚀 Start your TapCoin journey' },
      { command: 'help', description: 'ℹ️ Get help & channel link' },
    ]);

    return NextResponse.json({
      status: 200,
      message: '✅ Webhook + Commands set successfully (menu untouched)',
      webhook: WEBHOOK_URL,
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
