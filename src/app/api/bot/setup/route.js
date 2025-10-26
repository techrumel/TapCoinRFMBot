import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(botToken);

// Tomar correct Vercel URL
const WEBHOOK_URL = `https://tap-coin-rfm-bot.vercel.app/api/bot/webhook`;

export async function GET() {
  if (!botToken) {
    return NextResponse.json({ status: 500, message: 'Bot Token not found' });
  }

  try {
    // 1. Webhook Set koro
    // Etai Telegram-ke bolbe je tomar notun code kothay ache
    const webhookSet = await bot.telegram.setWebhook(WEBHOOK_URL);
    if (!webhookSet) {
      throw new Error('Failed to set webhook');
    }

    // 2. "Menu" Button-take BotFather-er default (/) menu-te set koro
    await bot.telegram.setChatMenuButton({
      menu_button: {
        type: 'commands' // 'commands' mane hocche default (/) button
      }
    });

    // 3. Bot-er command list update koro
    await bot.telegram.setMyCommands([
      { command: 'start', description: '🚀 Show Menu & All Options' },
      { command: 'help', description: 'ℹ️ Get Help & Channel Link' }
    ]);

    return NextResponse.json({ 
      status: 200, 
      message: 'Bot setup successful! (Menu Button Restored to Default)',
      webhook: WEBHOOK_URL,
      menuButton: 'Set to Commands'
    });

  } catch (error) {
    console.error('Error setting up bot:', error);
    return NextResponse.json({ status: 500, message: 'Setup Failed', error: error.message });
  }
}