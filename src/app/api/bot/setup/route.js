import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(botToken);

// Ei URL-ta Vercel deploy korar por pabe
// Tomar project-er main URL hobe
const WEBHOOK_URL = `https://tapcoinrmfbot.vercel.app/api/bot/webhook`;

// Tomar Mini App-er URL
const WEB_APP_URL = 'https://t.me/TapcoinRMFBOT/tapcoin';

export async function GET() {
  if (!botToken) {
    return NextResponse.json({ status: 500, message: 'Bot Token not found' });
  }

  try {
    // 1. Webhook Set koro (Telegram-ke bolo shob message kothay pathabe)
    const webhookSet = await bot.telegram.setWebhook(WEBHOOK_URL);
    if (!webhookSet) {
      throw new Error('Failed to set webhook');
    }

    // 2. "Menu" Button Set koro (Professional look)
    await bot.telegram.setChatMenuButton({
      menu_button: {
        type: 'web_app',
        text: 'Open App', // Button-e ki lekha thakbe
        web_app: { url: WEB_APP_URL }
      }
    });

    return NextResponse.json({ 
      status: 200, 
      message: 'Bot setup successful!',
      webhook: WEBHOOK_URL,
      menuButton: 'Set to open Web App'
    });

  } catch (error) {
    console.error('Error setting up bot:', error);
    return NextResponse.json({ status: 500, message: 'Setup Failed', error: error.message });
  }
}