import { createHmac } from 'crypto';

export async function validateInitData(initDataString) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env.local');
  }

  const urlParams = new URLSearchParams(initDataString);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  // Sort keys alphabetically
  const keys = [];
  for (const key of urlParams.keys()) {
    keys.push(key);
  }
  keys.sort();

  // Create data_check_string
  const dataCheckString = keys
    .map((key) => `${key}=${urlParams.get(key)}`)
    .join('\n');

  // Create the secret key
  const secretKey = await createHmac('sha256', 'WebAppData').update(botToken).digest();

  // Create and check the hash
  const checkHash = await createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // Return user data if hash is valid
  if (checkHash === hash) {
    const user = JSON.parse(urlParams.get('user'));
    const startParam = urlParams.get('start_param') || null;
    return { valid: true, user, startParam };
  }

  return { valid: false };
}