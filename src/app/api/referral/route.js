// src/app/api/referral/route.js
import { NextResponse } from 'next/server';

// For production, use a persistent database like Vercel Postgres, Supabase, or Firebase.
// This is an in-memory object for demonstration purposes.
let referralsDb = {}; // e.g., { referrerId: { count: 5, referees: [id1, id2, ...] } }

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  const userReferrals = referralsDb[userId]?.count || 0;
  return NextResponse.json({ referralCount: userReferrals });
}

export async function POST(request) {
  const { referrerId, refereeId } = await request.json();

  if (!referrerId || !refereeId) {
    return NextResponse.json({ message: 'Referrer and Referee IDs are required' }, { status: 400 });
  }

  if (!referralsDb[referrerId]) {
    referralsDb[referrerId] = { count: 0, referees: [] };
  }

  // A user can only be referred once
  if (referralsDb[referrerId].referees.includes(refereeId)) {
    return NextResponse.json({ message: 'User already referred' }, { status: 200 });
  }

  referralsDb[referrerId].count += 1;
  referralsDb[referrerId].referees.push(refereeId);

  return NextResponse.json({ message: 'Referral successful' }, { status: 201 });
}