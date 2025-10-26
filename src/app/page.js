// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import AdsManager from '../components/AdsManager';
import RewardedAd from '../components/RewardedAd';
import WithdrawalSystem from '../components/WithdrawalSystem';

export default function HomePage() {
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [referralCount, setReferralCount] = useState(0);
  const [referralLink, setReferralLink] = useState('');

  // টেলিগ্রাম এবং রেফারেল সিস্টেম চালু করার জন্য Effect
  useEffect(() => {
    const initializeApp = async () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        const currentUser = tg.initDataUnsafe?.user;
        if (currentUser) {
          setUser(currentUser);
          // ইউজারের রেফারেল লিংক তৈরি করুন
          setReferralLink(`https://t.me/TapcoinRMFBOT?start=ref_${currentUser.id}`);

          // ইউজারের রেফারেল সংখ্যা আনুন
          fetch(`/api/referral?userId=${currentUser.id}`)
            .then(res => res.json())
            .then(data => setReferralCount(data.referralCount || 0));

          // নতুন রেফারেল রেজিস্টার করুন
          const startParam = tg.initDataUnsafe?.start_param;
          if (startParam && startParam.startsWith('ref_')) {
            const referrerId = startParam.split('_')[1];
            // নিশ্চিত করুন যে ইউজার নিজেকে রেফার করছে না
            if (referrerId !== String(currentUser.id)) {
              // লোকাল স্টোরেজ ব্যবহার করে ডুপ্লিকেট রেজিস্টার প্রতিরোধ করুন
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

  // Monetag In-App Interstitial বিজ্ঞাপন দেখানোর জন্য Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window.show_10096305 === 'function') {
        console.log("Showing In-App Interstitial Ad...");
        // আপনার Monetag ড্যাশবোর্ড থেকে সেটিংস কনফিগার করুন
        window.show_10096305({ type: 'inApp' });
      }
    }, 8000); // অ্যাপ খোলার ৮ সেকেন্ড পর বিজ্ঞাপন দেখাবে

    return () => clearTimeout(timer);
  }, []);

  const handleTap = () => setScore(prev => prev + 1);
  const handleReward = (amount) => setScore(prev => prev + amount);

  return (
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
        {/* Referral System UI */}
        <div className="bg-gray-900 p-3 rounded-lg mb-2 text-center">
            <p className="font-bold mb-1">Invite Friends!</p>
            <input type="text" readOnly value={referralLink} className="w-full p-1 text-center bg-gray-700 rounded text-sm"/>
        </div>

        <RewardedAd onReward={handleReward} />
        <AdsManager type="adsterra_banner" placementId="YOUR_ADSTERRA_BANNER_ID" />
        <WithdrawalSystem currentScore={score} referralCount={referralCount} />
      </div>
    </div>
  );
}