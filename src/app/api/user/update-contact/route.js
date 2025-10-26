import { NextResponse } from 'next/server';
import { validateInitData } from '@/lib/telegram-validation';
import { db } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const { initData, phone } = await request.json();

    // 1. Validate Telegram User
    const { valid, user } = await validateInitData(initData);

    if (!valid || !user) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 401 });
    }

    // 2. Get User Reference
    const userRef = db.collection('users').doc(String(user.id));

    // 3. Update phone number in Database
    await userRef.update({
      phone: phone || "Shared" // Jodi number na pai, shudhu "Shared" likhe rakhi
    });
    
    console.log(`User ${user.id} updated their contact info.`);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API Error (update-contact):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}