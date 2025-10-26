import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Get top 50 users, ordered by totalScore (descending)
    const usersSnapshot = await db.collection('users')
      .orderBy('totalScore', 'desc')
      .limit(50)
      .get();

    if (usersSnapshot.empty) {
      return NextResponse.json([]);
    }

    // Shudhu dorkari data pathao
    const leaderboard = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        username: data.username || 'User',
        score: data.totalScore || 0,
      };
    });

    return NextResponse.json(leaderboard);

  } catch (error) {
    console.error('API Error (leaderboard):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}