import { Telegraf } from 'telegraf';
import { NextResponse } from 'next/server';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable not set!');
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// --- Your Links ---
const APP_URL = 'https://t.me/TapcoinRMFBOT/tapcoin';
const CHANNEL_URL = 'https://t.me/RedMarkFiles';

// --- Bot Command Setup ---

// 1. /start command (Simple Text + Instructions)
bot.start(async (ctx) => {
  const firstName = ctx.from.first_name || 'Player';
  const message = `
👋 Welcome, ${firstName}!

Ready to earn some coins? 💰

Use these commands:
/open - Launch the TapCoin app & see options
/help - Learn how to play and withdraw

Tap away and climb the leaderboard! 🚀
  `;
  await ctx.reply(message);
});

// 2. /open command (Attractive Message + Buttons)
bot.command('open', async (ctx) => {
  const userId = ctx.from.id;
  const message = `
🔥 Let's Tap & Earn! 🔥

Click '🚀 Play Now!' to jump into the game. Invite your friends to earn even more rewards!
  `;

  await ctx.reply(message, {
    reply_markup: {
      inline_keyboard: [
        // Main App Button
        [
          { text: '🚀 Play Now!', web_app: { url: APP_URL } }
        ],
        // Invite and Channel Buttons
        [
          { text: '🎁 Invite & Earn', url: `https://t.me/share/url?url=https://t.me/TapcoinRMFBOT/tapcoin?startapp=ref_${userId}&text=Join%20me%20on%20TapCoin%20and%20earn%21` },
          { text: '📢 Our Channel', url: CHANNEL_URL }
        ]
      ]
    }
  });
});

// 3. /help command (Detailed Info + Channel Button)
bot.command('help', (ctx) => {
  const helpMessage = `
ℹ️ **How TapCoin Works:**

1.  **Tap to Earn:** Open the app (using /open) and tap the coin to earn coins.
2.  **Energy:** Each tap uses energy. Energy refills over time.
3.  **Referrals:** Invite friends using your unique link (find it in the app). You need 10 referrals to enable withdrawals.
4.  **Withdraw:** Once you have 10 referrals and enough coins (20 Million = $20 USD), use the 'Withdraw' button in the app. Follow the instructions in the pop-up.
5.  **Leaderboard:** Check your rank against other players in the 'Rank' tab.

Stay updated and get support in our channel! 👇
  `;
  ctx.replyWithMarkdown(helpMessage, { // Using Markdown for bold text
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📢 Join Our Channel', url: CHANNEL_URL }
        ]
      ]
    }
  });
});

// 4. Catch-all message handler (for any other text)
bot.on('message', async (ctx) => {
  const text = ctx.message?.text || '';
  // Avoid re-triggering commands
  if (text.startsWith('/start') || text.startsWith('/help') || text.startsWith('/open')) return; 
  
  await ctx.reply("Sorry, I didn't understand that. Use /start to see the main commands.");
});


// --- Main API Handler ---
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

// --- Health check ---
export async function GET() {
  return NextResponse.json({ status: 200, message: 'Bot Webhook Active' });
}