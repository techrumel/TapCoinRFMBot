// src/app/page.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdsManager from '../components/AdsManager';
import RewardedAd from '../components/RewardedAd';
import WithdrawalSystem from '../components/WithdrawalSystem';

export default function HomePage() {
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [referralCount, setReferralCount] = useState(0);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const initializeApp = async () => {
      if (globalThis.Telegram && globalThis.Telegram.WebApp) {
        const tg = globalThis.Telegram.WebApp;
        tg.ready();
        tg.expand();

        const currentUser = tg.initDataUnsafe?.user;
        if (currentUser) {
          setUser(currentUser);
          setReferralLink(`https://t.me/TapcoinRMFBOT?start=ref_${currentUser.id}`);

          // Fetch user's referral count
          fetch(`/api/referral?userId=${currentUser.id}`)
            .then(res => res.json())
            .then(data => setReferralCount(data.referralCount || 0));

          // Register a new referral if applicable
          const startParam = tg.initDataUnsafe?.start_param;
          if (startParam && startParam.startsWith('ref_')) {
            const referrerId = startParam.split('_')[1];
            if (referrerId !== String(currentUser.id)) {
              const referred = localStorage.getItem('referred_by');
              if (!referred) {
                fetch('/api/referral', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ referrerId, refereeId: currentUser.id }),
                }).then(() => {
                  localStorage.setItem('referred_by', referrerId);
                });
              }
            }
          }
        }
      }
    };
    initializeApp();
  }, []);

  const handleTap = () => setScore(prev => prev + 1);
  const handleReward = (amount) => setScore(prev => prev + amount);

  return (
    <>
      {/* Adsterra Social Bar will be active on all pages */}
      <AdsManager type="adsterra_social_bar" zoneId="YOUR_SOCIAL_BAR_ZONE_ID" />

      <div className="flex flex-col items-center justify-between min-h-screen bg-gray-800 text-white p-4 font-sans">
        <div className="w-full text-center">
          <h1 className="text-lg">Welcome, {user ? user.first_name : 'Player'}!</h1>
          <span className="text-5xl font-bold">{score.toLocaleString()}</span>
        </div>

        <div
          className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center cursor-pointer select-none transform transition-transform active:scale-95"
          onClick={handleTap}
        >
          <span className="text-5xl font-extrabold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>TAP</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="bg-gray-900 p-3 rounded-lg mb-2 text-center">
              <p className="font-bold mb-1">Invite Friends!</p>
              <input type="text" readOnly value={referralLink} className="w-full p-1 text-center bg-gray-700 rounded text-sm"/>
          </div>

          <RewardedAd onReward={handleReward} />
          
          {/* Link to Tasks Page */}
          <Link href="/tasks" className="block w-full text-center bg-purple-600 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg my-2 text-lg">
              Earn More Coins
          </Link>
          
          {/* Placeholder for Adsterra Native Banner */}
          <AdsManager type="adsterra_native_banner" zoneId="YOUR_NATIVE_BANNER_ZONE_ID" />

          <WithdrawalSystem currentScore={score} referralCount={referralCount} />
        </div>
      </div>
    </>
  );
}