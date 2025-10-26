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

// 1. /start command (Shudhu Simple Text)
bot.start(async (ctx) => {
  const firstName = ctx.from.first_name || 'Player';
  const message = `👋 Welcome, ${firstName}!\n\nType /open to launch the app and see all options.`;
  await ctx.reply(message);
});

// 2. Notun /open command (Shob Button Ekhane)
bot.command('open', async (ctx) => {
  const userId = ctx.from.id;
  const message = `🚀 Get ready to earn!\n\nClick '🔥 START TAPPING' below to open the app.`;

  await ctx.reply(message, {
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

// 3. /help command (Channel link shoh)
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

// 4. Onno jekono message dile
bot.on('message', async (ctx) => {
  await ctx.reply("Sorry, I'm just a bot. Use the /start or /open command.");
});


// --- Main API Handler ---
export async function POST(request) {
  try {
    const body = await request.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ status: 200, message: 'OK' });
  } catch (error) {
    console.error('Error handling Telegram update:', error);
    return NextResponse.json({ status: 500, message: 'Error' });
  }
}

export async function GET() {
  return NextResponse.json({ status: 200, message: 'Bot is listening...' });
}