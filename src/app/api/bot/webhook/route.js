import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable not set!');
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// --- Tomar Mini App ebong Onanno Link ---
const APP_URL = 'https://t.me/TapcoinRMFBOT/tapcoin';
const SUPPORT_GROUP_URL = 'https://t.me/RedMarkFiles'; // Tomar Support Group Link
const CHANNEL_URL = 'https://t.me/RedMarkFiles'; // Tomar Channel Link (jodi thake)


// --- Bot Command Setup ---

// 1. /start command (Ekhon onek button thakbe)
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const welcomeMessage = `👋 Welcome to TapCoin, ${ctx.from.first_name}!\n\nClick the button below to open the app and start earning coins.\n\nNeed help? Click 'Support'.`;

  await ctx.reply(welcomeMessage, {
    reply_markup: {
      inline_keyboard: [
        // Prothom row: Main App Button
        [
          { text: '🚀 Open App & Earn', web_app: { url: APP_URL } }
        ],
        // Ditiyo row: Support ebong Channel
        [
          { text: '💬 Support Group', url: SUPPORT_GROUP_URL },
          { text: '📢 Our Channel', url: CHANNEL_URL }
        ],
        // Tritiyo row: Invite link
        [
          { text: '🎁 Invite Friends & Earn More!', url: `https://t.me/share/url?url=https://t.me/TapcoinRMFBOT/tapcoin?startapp=ref_${userId}&text=Join%20me%20on%20TapCoin%20and%20earn%21` }
        ]
      ]
    }
  });
});

// 2. /help command
bot.command('help', (ctx) => {
  ctx.reply('Please type /start to see all options or open the app from the menu.');
});

// 3. /support command
bot.command('support', (ctx) => {
  ctx.reply(`Need help? Join our support group: ${SUPPORT_GROUP_URL}`);
});

// 4. Onno jekono message dile
bot.on('message', async (ctx) => {
  await ctx.reply('Sorry, I am just a bot. Please use the /start command or open the app from the menu button below.');
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