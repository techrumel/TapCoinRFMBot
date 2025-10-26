import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable not set!');
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// --- Your Links ---
const APP_URL = 'https://t.me/TapcoinRMFBOT/tapcoin';
const CHANNEL_URL = 'https://t.me/RedMarkFiles';
const WELCOME_IMAGE_URL =
  'https://static.toiimg.com/thumb/msid-114671742,imgsize-28600,width-400,resizemode-4/114671742.jpg';

// 🟢 /start command
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const firstName = ctx.from.first_name || 'Player';

  const caption = `
👋 *Welcome, ${firstName}!*

Tap the coin, invite friends, and earn rewards.
Click below to begin your TapCoin journey! 🔥
  `;

  await ctx.replyWithPhoto(WELCOME_IMAGE_URL, {
    caption,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔥 Play & Earn', web_app: { url: APP_URL } }],
        [
          {
            text: '🎁 Invite Friends',
            url: `https://t.me/share/url?url=https://t.me/TapcoinRMFBOT/tapcoin?startapp=ref_${userId}&text=Join%20TapCoin%20and%20earn!`,
          },
          { text: '📢 Our Channel', url: CHANNEL_URL },
        ],
      ],
    },
  });
});

// 🟢 /help command
bot.command('help', async (ctx) => {
  await ctx.reply('Need help or want updates? Join our official channel 👇', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📢 Join Our Channel', url: CHANNEL_URL }],
      ],
    },
  });
});

// 🟢 Catch-all message handler (for any other text)
bot.on('message', async (ctx) => {
  const text = ctx.message?.text || '';
  // Avoid re-triggering /start or /help if it's handled above
  if (text.startsWith('/start') || text.startsWith('/help')) return; 
  
  await ctx.reply("Use /start to begin or press the 'Open' button below.");
});


// 🟢 Webhook Handler
export async function POST(req) {
  try {
    const body = await req.json();
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error handling update:', err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

// 🟢 Health check
export async function GET() {
  return NextResponse.json({ status: 200, message: 'Bot Webhook Active' });
}