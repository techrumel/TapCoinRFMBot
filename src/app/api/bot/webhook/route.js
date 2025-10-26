import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

// Check korbe jodi token thake
if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable not set!');
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// --- Bot Command Setup ---

// 1. /start command dile ki hobe
bot.start(async (ctx) => {
  const appUrl = 'https://t.me/TapcoinRMFBOT/tapcoin'; // Tomar mini app-er link
  const message = `👋 Welcome to TapCoin, ${ctx.from.first_name}!\n\nClick the "Open App" button below to start tapping and earning coins.`;

  await ctx.reply(message, {
    // Ekta inline button toiri koro
    reply_markup: {
      inline_keyboard: [
        [
          // Button-e click korle tomar app open hobe
          { text: '🚀 Open App', web_app: { url: appUrl } }
        ],
        [
          // Bonus: User-ke invite link-o diye dao
          { text: '🎁 Invite Friends', url: `https://t.me/share/url?url=https://t.me/TapcoinRMFBOT/tapcoin?startapp=ref_${ctx.from.id}&text=Join%20me%20on%20TapCoin%20and%20earn%21` }
        ]
      ]
    }
  });
});

// 2. /help command
bot.command('help', async (ctx) => {
  await ctx.reply('Tap the "Menu" button or type /start to launch the app!');
});

// 3. Onno jekono message dile
bot.on('message', async (ctx) => {
  await ctx.reply('I am just a bot! Please click the "Menu" button below to use the app.');
});


// --- Main API Handler ---
// Ei function-ta Telegram theke shob message receive korbe
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

// Ei line-ta dorkar jodi GET request ashe (browser theke)
export async function GET() {
  return NextResponse.json({ status: 200, message: 'Bot is listening...' });
}