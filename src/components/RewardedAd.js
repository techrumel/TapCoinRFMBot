// src/components/RewardedAd.js
'use client';

const RewardedAd = ({ onReward }) => {
  const handleShowAd = () => {
    // window অবজেক্টে Monetag SDK ফাংশনটি আছে কিনা তা পরীক্ষা করুন
    if (typeof window.show_10096305 === 'function') {
      window.show_10096305() // Rewarded Interstitial কল করা হচ্ছে
        .then(() => {
          // ব্যবহারকারী বিজ্ঞাপন দেখলে এই কোডটি চলবে
          console.log('Ad watched successfully!');
          onReward(1000); // ব্যবহারকারীকে ১০০০ কয়েন পুরস্কার দিন
        })
        .catch(e => {
          console.error('Ad failed to show:', e);
          alert('Ad could not be loaded. Please try again later.');
        });
    } else {
      console.error('Monetag SDK function not found.');
      alert('Ad service is currently unavailable.');
    }
  };

  return (
    <button
      onClick={handleShowAd}
      className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg my-2 text-lg"
    >
      বিজ্ঞাপন দেখুন (+1,000 Coins)
    </button>
  );
};

export default RewardedAd;