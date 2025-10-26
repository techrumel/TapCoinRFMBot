import { NextResponse } from 'next/server';
import { validateInitData } from '@/lib/telegram-validation';
import { db, FieldValue } from '@/lib/firebase-admin'; // FieldValue import koro

export async function POST(request) {
  try {
    const { initData } = await request.json();

    // 1. Validate Telegram User
    const { valid, user, startParam } = await validateInitData(initData);

    if (!valid || !user) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 401 });
    }

    const userId = String(user.id);
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    let referrerId = startParam ? startParam.replace('ref_', '') : null;
    if (referrerId === userId) referrerId = null; // Nije nijeke refer kora jabe na

    let userData;
    let referrerUsername = null; // --- Notun ---

    if (!userDoc.exists) {
      // --- Create New User ---
      console.log(`Creating new user: ${userId}`);
      userData = {
        id: userId,
        username: user.username || user.first_name || 'user',
        totalScore: 0,
        referralCount: 0,
        referredById: referrerId || null,
        createdAt: new Date().toISOString(),
      };
      await userRef.set(userData);

      // --- Process Referral ---
      if (referrerId) {
        try {
          const referrerRef = db.collection('users').doc(referrerId);
          await referrerRef.update({ 
            referralCount: FieldValue.increment(1) 
          });
          console.log(`Referrer ${referrerId} count incremented.`);
        } catch (err) {
          console.error(`Failed to update referrer ${referrerId}:`, err.message);
        }
      }
    } else {
      // --- User already exists ---
      userData = userDoc.data();
    }

    // --- Notun Kaj: Referrer-er Naam Khuje Ber Koro ---
    if (userData.referredById) {
      try {
        const referrerDoc = await db.collection('users').doc(userData.referredById).get();
        if (referrerDoc.exists) {
          referrerUsername = referrerDoc.data().username || 'A Friend';
        }
      } catch (err) {
        console.warn('Could not fetch referrer username');
      }
    }

    // 4. Return REAL data from database
    return NextResponse.json({
      totalScore: userData.totalScore || 0,
      referralCount: userData.referralCount || 0,
      referrerUsername: referrerUsername, // <-- Notun data pathano hocche
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}