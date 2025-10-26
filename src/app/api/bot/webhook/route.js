import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable not set!');
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// --- Tomar Link-gulo ---
const APP_URL = 'https://t.me/TapcoinRMFBOT/tapcoin';
const CHANNEL_URL = 'https://t.me/RedMarkFiles';
// --- Tomar Game-er Welcome Image ---
// Tumi ekhane tomar nijer banano ekta banner image-er direct URL dibe
const WELCOME_IMAGE_URL = 'https://static.toiimg.com/thumb/msid-114671742,imgsize-28600,width-400,resizemode-4/114671742.jpg'; // Eita shudhu ekta example image

// --- Bot Command Setup ---

// 1. /start command (MemeFi Style)
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const firstName = ctx.from.first_name || 'Player';

  const welcomeMessage = `
👋 *Welcome, ${firstName}!*

Tap the coin, invite friends, and earn real rewards. Your journey starts now!

Click '🔥 Play & Earn' to enter!
  `;

  // Shudhu text-er bodole 'replyWithPhoto' use koro
  await ctx.replyWithPhoto(WELCOME_IMAGE_URL, {
    caption: welcomeMessage, // Text-ta photo-r niche caption hishebe jabe
    parse_mode: 'Markdown',  // Caption-e styling-er jonno
    reply_markup: {
      inline_keyboard: [
        // Prothom Row: Main App Button
        [
          { text: '🔥 Play & Earn', web_app: { url: APP_URL } }
        ],
        // Ditiyo Row: Invite ebong Channel
        [
          { text: '🎁 Invite Friends', url: `https://t.me/share/url?url=https://t.me/TapcoinRMFBOT/tapcoin?startapp=ref_${userId}&text=Join%20me%20on%20TapCoin%20and%20earn%21` },
          { text: '📢 Our Channel', url: CHANNEL_URL }
        ]
      ]
    }
  });
});

// 2. /help command (Channel link shoh)
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
  await ctx.reply("Sorry, I'm just a bot. Use the /start command or press the 'Play' button below.");
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