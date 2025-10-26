// src/app/api/referral/route.js
import { NextResponse } from 'next/server';

// প্রোডাকশনের জন্য এখানে একটি স্থায়ী ডেটাবেস (যেমন Vercel Postgres) ব্যবহার করুন
// আপাতত আমরা একটি ইন-মেমোরি অবজেক্ট ব্যবহার করছি
let referralsDb = {}; // { referrerId: { count: 5, referees: [id1, id2, ...] } }

// GET: একজন ইউজারের রেফারেল সংখ্যা জানতে
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  const userReferrals = referralsDb[userId]?.count || 0;
  return NextResponse.json({ referralCount: userReferrals });
}

// POST: নতুন রেফারেল যোগ করতে
export async function POST(request) {
  const { referrerId, refereeId } = await request.json();

  if (!referrerId || !refereeId) {
    return NextResponse.json({ message: 'Referrer and Referee IDs are required' }, { status: 400 });
  }

  // যদি রেফারার ডাটাবেসে না থাকে, তাকে যোগ করুন
  if (!referralsDb[referrerId]) {
    referralsDb[referrerId] = { count: 0, referees: [] };
  }

  // একজন ইউজার কেবল একবারই রেফারেল হিসেবে গণ্য হবে
  if (referralsDb[referrerId].referees.includes(refereeId)) {
    return NextResponse.json({ message: 'User already referred' }, { status: 200 });
  }

  referralsDb[referrerId].count += 1;
  referralsDb[referrerId].referees.push(refereeId);

  console.log('Updated Referrals DB:', referralsDb); // ডিবাগিং এর জন্য

  return NextResponse.json({ message: 'Referral successful' }, { status: 201 });
}