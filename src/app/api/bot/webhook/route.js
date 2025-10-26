import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable not set!');
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// --- Tomar Link-gulo ---
const APP_URL = 'https://t.me/TapcoinRMFBOT/tapcoin';
const CHANNEL_URL = 'https://t.me/RedMarkFiles'; // Tomar Main Channel Link

// --- 1. Randomized Attractive Messages ---
const welcomeTitles = [
  "Welcome, {NAME}! 💸",
  "Hey {NAME}! Ready to earn? 🔥",
  "You're here, {NAME}! 🚀",
  "Let's go, {NAME}! 💰"
];

const welcomeDescriptions = [
  "Your tapping session is ready! Click the button below to start collecting coins and climb the leaderboard.",
  "Tap the coin, invite your friends, and earn real rewards. Your journey starts now!",
  "We've been waiting for you! Click 'Start Tapping' to jump straight into the game."
];

// Helper function to pick a random item
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- Bot Command Setup ---

// 2. Notun /start command (Onek attractive)
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const firstName = ctx.from.first_name || 'Player'; // Fallback

  // Random message toiri koro
  const title = randomItem(welcomeTitles).replace('{NAME}', firstName);
  const description = randomItem(welcomeDescriptions);
  const welcomeMessage = `*${title}*\n\n${description}`;

  await ctx.replyWithMarkdown(welcomeMessage, { // Markdown use korchi
    reply_markup: {
      inline_keyboard: [
        // Prothom Row: Main App Button (Boro ebong Attractive)
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

// 3. Upgraded /help command (Channel link shoh)
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

// 4. /support command remove kora hoyeche

// 5. Onno jekono message dile
bot.on('message', async (ctx) => {
  await ctx.reply("Sorry, I'm just a bot. Use the /start command to see your options or open the app from the 'Menu' button below.");
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