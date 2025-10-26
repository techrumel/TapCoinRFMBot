import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable not set!');
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// --- Tomar Link-gulo ---
const APP_URL = 'https://t.me/TapcoinRMFBOT/tapcoin';
const CHANNEL_URL = 'https://t.me/RedMarkFiles'; // Tomar Main Channel Link

// --- Bot Command Setup ---

// 1. /start command (Ekhon 100% kaj korbe)
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const firstName = ctx.from.first_name || 'Player';

  const welcomeMessage = `
👋 Welcome, ${firstName}!

This is your main menu. Click the button below to start tapping, or use a command.

Available Commands:
/start - Show this menu
/help - Join our channel for updates

Click '🔥 START TAPPING' to enter the app!
  `;

  await ctx.reply(welcomeMessage, { // Markdown chara simple reply
    reply_markup: {
      inline_keyboard: [
        // Prothom Row: Main App Button
        [
          { text: '🔥 START TAPPING 🔥', web_app: { url: APP_URL } }
        ],
        // Ditiyo Row: Invite ebong Channel
        [
          { text: '🎁 Invite & Earn', url: `https://t.me/share/url?url=https://t.me/TapcoinRMFBOT/tapcoin?startapp=ref_${userId}&text=Join%20me%20on%20TapCoin%20and%20earn%21` },
          { text: '📢 Our Channel', url: CHANNEL_URL }
        ]
      ]
    }
  });
});

// 2. /help command (Eta thik chilo)
bot.command('help', (ctx) => {
  ctx.reply('Need help or want to see updates? Join our official channel!', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📢 Join Our Channel', url: CHANNEL_URL }
        ]
      ]
    }
  });
});

// 3. Onno jekono message dile
bot.on('message', async (ctx) => {
  await ctx.reply("Sorry, I'm just a bot. Use the /start command to see your options.");
});


// --- Main API Handler ---
export async function POST(request) {
  try {
    const body = await request.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ status: 200, message: 'OK' });
  } catch (error) {
    console.error('Error handling Telegram update:', error.message);
    return NextResponse.json({ status: 500, message: 'Error' });
  }
}

export async function GET() {
  return NextResponse.json({ status: 200, message: 'Bot is listening...' });
}