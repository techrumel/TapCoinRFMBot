import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(botToken);

// Tomar Vercel project-er main URL
// ** IMPORTNAT: Tomar URL thik ache kina check kore niyo **
const WEBHOOK_URL = `https://tapcoinrmfbot.vercel.app/api/bot/webhook`;

// Tomar Mini App-er URL
const WEB_APP_URL = 'https://t.me/TapcoinRMFBOT/tapcoin';

export async function GET() {
  if (!botToken) {
    return NextResponse.json({ status: 500, message: 'Bot Token not found' });
  }

  try {
    // 1. Webhook Set koro
    const webhookSet = await bot.telegram.setWebhook(WEBHOOK_URL);
    if (!webhookSet) {
      throw new Error('Failed to set webhook');
    }

    // 2. "Menu" Button Set koro (Professional look)
    // Ekhon "Open App" er bodole shudhu "Menu" dekhabe
    await bot.telegram.setChatMenuButton({
      menu_button: {
        type: 'commands' // <-- Change kora hoyeche
      }
    });

    // 3. Bot-er command list set koro
    // Menu button-e click korle eigulo dekhabe
    await bot.telegram.setMyCommands([
      { command: 'start', description: '🚀 Open App & See Options' },
      { command: 'support', description: '💬 Get Help' },
      { command: 'help', description: 'ℹ️ Show Help' },
    ]);

    return NextResponse.json({ 
      status: 200, 
      message: 'Bot setup successful! (Updated with Commands Menu)',
      webhook: WEBHOOK_URL,
      menuButton: 'Set to Commands'
    });

  } catch (error) {
    console.error('Error setting up bot:', error);
    return NextResponse.json({ status: 500, message: 'Setup Failed', error: error.message });
  }
}