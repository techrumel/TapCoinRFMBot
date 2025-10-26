'use client';
import { useState, useEffect, useCallback } from 'react';
import BottomNav from '../../components/BottomNav';
import AdBanner from '../../components/AdBanner'; // <-- Ad component

// Task Titles
const taskTitles = [
    "Explore Special Offers", "Discover Partner Content", "Check Out This Link", 
    "View Exclusive Deals", "Your 25,000 Coin Bonus!", "Instant Reward Inside!",
    "Unlock This Deal Now!", "Today's Top Offer!", "Click for a Surprise!"
];
const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const dailyTasks = [
    { id: 1, reward: 25000, link: 'https://www.effectivegatecpm.com/xtip8ppfm?key=2ad0dd2e93d9548de0bb63de28d31a7d' },
    { id: 2, reward: 15000, link: 'https://otieu.com/4/6071291' },
    { id: 3, reward: 15000, link: 'https://otieu.com/4/6363819' },
    { id: 4, reward: 10000, link: 'https://otieu.com/4/6363813' },
].map((task, index) => ({ ...task, title: shuffleArray([...taskTitles])[index] || "Complete This Task" })); 

const partnershipTasks = [
    { id: 5, title: 'Partner with Adsterra', description: 'Join as a publisher. Best for website/app owners.', reward: 'Revenue Share', link: 'https://beta.publishers.adsterra.com/referral/6iKFPXUy1L' },
    { id: 6, title: 'Partner with Monetag', description: 'Monetize your traffic with this popular ad network.', reward: 'Partner Benefits', link: 'https://monetag.com/?ref_id=nZG4' },
]

// Rewarded Ad-er jonno coin
const REWARD_AMOUNT = 50000; // Tomi eke 100,000 o korte paro

export default function TasksPage() {
    const [initData, setInitData] = useState(null);
    const [isAdLoading, setIsAdLoading] = useState(false);

    // 1. Load Auth Data
    useEffect(() => {
        const tg = globalThis.Telegram?.WebApp;
        if (tg && tg.initData) {
            tg.ready();
            setInitData(tg.initData);
        } else {
            console.warn("Telegram initData not found. Rewards will not work in dev mode.");
        }
    }, []);

    // 2. Secure Reward Function
    const saveRewardToServer = useCallback(async (rewardAmount) => {
        if (!initData || rewardAmount <= 0) {
            console.error("No auth data or invalid reward.");
            return; 
        }
        try {
            await fetch('/api/user/update-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData, scoreToAdd: rewardAmount }),
            });
            console.log(`Successfully saved ${rewardAmount} coins to server.`);
        } catch (error) {
            console.error('Failed to save score to server:', error);
        }
    }, [initData]);

    // 3. Monetag Rewarded Ad Call
    const handleWatchRewardAd = () => {
        if (typeof show_10096305 === 'function') {
            setIsAdLoading(true);
            show_10096305().then(() => {
                // SUCCESS
                console.log('Ad watched successfully!');
                saveRewardToServer(REWARD_AMOUNT); 
                alert(`Congratulations! You earned ${REWARD_AMOUNT.toLocaleString()} coins!`);
                setIsAdLoading(false);
            }).catch(e => {
                // FAILED or Canceled
                console.error('Ad error or closed:', e);
                alert('Ad was not completed. No reward given.');
                setIsAdLoading(false);
            });
        } else {
            console.error('Monetag SDK function not found.');
            alert('Ad is not ready yet. Please try again in a moment.');
        }
    };

    // 4. Normal link click
    const handleGo = (link) => {
        window.open(link, '_blank');
    };

    return (
        <>
            <div className="flex flex-col items-center min-h-screen p-4 pb-24">
                <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Task Center</h1>
                
                {/* --- AD BANNER 1 (TOP) --- */}
                <AdBanner adKey="d229a298f12c0c653e1d0c97f68a077c" format="iframe" height={50} width={320} />
                
                <div className="w-full max-w-md space-y-4 mt-6">
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">Special Reward</h2>
                    
                    {/* --- REWARDED VIDEO TASK --- */}
                    <div className="bg-gray-800 border border-purple-500 p-4 rounded-xl flex justify-between items-center transition-all hover:scale-105 shadow-lg">
                        <div>
                            <h3 className="font-semibold text-lg text-white">Watch a Video Ad</h3>
                            <p className="text-yellow-400 font-bold">+{REWARD_AMOUNT.toLocaleString()} Coins</p>
                        </div>
                        <button 
                            onClick={handleWatchRewardAd} 
                            disabled={!initData || isAdLoading}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-5 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAdLoading ? 'Loading...' : 'Watch'}
                        </button>
                    </div>

                    {/* --- AD BANNER 2 (MIDDLE) --- */}
                    {/* Ekhane 300x250 high-value ad-ta dilam */}
                    <div className="py-2 flex justify-center">
                      <AdBanner adKey="39340d76f3a3d7b5a1ffba865eff0357" format="iframe" height={250} width={300} />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-300 pt-4 mb-2">Daily Rewards</h2>
                    {dailyTasks.map(task => (
                        <div key={task.id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl flex justify-between items-center transition-all hover:border-purple-500 hover:scale-105">
                            <div>
                                <h3 className="font-semibold text-lg">{task.title}</h3>
                                <p className="text-yellow-400 font-bold">+{task.reward.toLocaleString()} Coins</p>
                            </div>
                            <button onClick={() => handleGo(task.link)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-5 rounded-lg shadow-lg">
                                Go
                            </button>
                        </div>
                    ))}
                    
                    <h2 className="text-xl font-semibold text-gray-300 pt-6 mb-2">Partnerships</h2>
                    {partnershipTasks.map(task => (
                        <div key={task.id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl flex justify-between items-center transition-all hover:border-green-500 hover:scale-105">
                            <div>
                                <h3 className="font-semibold text-lg">{task.title}</h3>
                                <p className="text-gray-400 text-sm mb-1">{task.description}</p>
                                <p className="text-green-400 font-bold">{task.reward}</p>
                            </div>
                            <button onClick={() => handleGo(task.link)} className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-2 px-5 rounded-lg shadow-lg">
                                Join
                            </button>
                        </div>
                    ))}

                    {/* --- AD BANNER 3 (BOTTOM) --- */}
                    <div className="py-2">
                      <AdBanner adKey="d229a298f12c0c653e1d0c97f68a077c" format="iframe" height={50} width={320} />
                    </div>
                </div>
            </div>
            <BottomNav />
        </>
    );
}