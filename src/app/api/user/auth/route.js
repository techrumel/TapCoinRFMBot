import { NextResponse } from 'next/server';
import { validateInitData } from '@/lib/telegram-validation';
import { db } from '@/lib/firebase-admin'; // Firebase import koro

// --- Main API Handler ---
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
    // User nije nijeke refer korte parbena
    if (referrerId === userId) {
      referrerId = null; 
    }

    let userData;

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

      // --- Process Referral (jodi notun user hoy) ---
      if (referrerId) {
        try {
          const referrerRef = db.collection('users').doc(referrerId);
          // Use FieldValue to atomically increment the count
          await referrerRef.update({ 
            referralCount: admin.firestore.FieldValue.increment(1) 
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

    // 4. Return REAL data from database
    return NextResponse.json({
      totalScore: userData.totalScore || 0,
      referralCount: userData.referralCount || 0,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}