'use client';
import BottomNav from '../../components/BottomNav';
import AdBanner from '../../components/AdBanner'; // <-- 1. Import AdBanner

// 2. More "click-byte" titles
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
].map((task, index) => ({ ...task, title: shuffleArray([...taskTitles])[index] || "Complete This Task" })); // Added a fallback title


// 3. Updated Partnership tasks with instructions
const partnershipTasks = [
    { 
      id: 5, 
      title: 'Partner with Adsterra', 
      description: 'Join as a publisher. Best for website/app owners.',
      reward: 'Revenue Share', 
      link: 'https://beta.publishers.adsterra.com/referral/6iKFPXUy1L' 
    },
    { 
      id: 6, 
      title: 'Partner with Monetag', 
      description: 'Monetize your traffic with this popular ad network.',
      reward: 'Partner Benefits', 
      link: 'https://monetag.com/?ref_id=nZG4' 
    },
]

export default function TasksPage() {
    const handleGo = (link) => {
        window.open(link, '_blank');
    };

    return (
        <>
            {/* Added pb-24 (padding-bottom) so BottomNav doesn't cover content */}
            <div className="flex flex-col items-center min-h-screen p-4 pb-24">
                <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Task Center</h1>
                
                {/* 4. Added AdBanner at the top */}
                <AdBanner adKey="d229a298f12c0c653e1d0c97f68a077c" format="iframe" height={50} width={320} />
                
                <div className="w-full max-w-md space-y-4 mt-6">
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">Daily Rewards</h2>
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
                    
                    {/* 5. Replaced "Upcoming" task with another AdBanner */}
                    <div className="py-2">
                      <AdBanner adKey="d229a298f12c0c653e1d0c97f68a077c" format="iframe" height={50} width={320} />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-300 pt-6 mb-2">Partnerships</h2>
                    
                    {/* 6. Updated JSX for Partnership tasks */}
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
                </div>
            </div>
            <BottomNav />
        </>
    );
}