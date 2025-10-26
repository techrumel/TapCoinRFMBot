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
    // 1️⃣ Set Webhook (Tells Telegram where your new code is)
    await bot.telegram.setWebhook(WEBHOOK_URL);

    // 2️⃣ Set commands (Adds /open to the list)
    await bot.telegram.setMyCommands([
      { command: 'start', description: '👋 Welcome & Instructions' },
      { command: 'open', description: '🚀 Open the TapCoin App' },
      { command: 'help', description: 'ℹ️ How to Play & Withdraw' },
    ]);

    // 3️⃣ Menu button is NOT changed here

    return NextResponse.json({
      status: 200,
      message: '✅ Webhook + Commands updated successfully (menu untouched)',
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