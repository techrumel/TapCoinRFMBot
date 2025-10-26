// src/app/tasks/page.js
'use client';
import BottomNav from '../../components/BottomNav';

// Dynamic task titles
const taskTitles = ["Explore Special Offers", "Discover Partner Content", "Check Out This Link", "View Exclusive Deals"];
const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const dailyTasks = [
    { id: 1, reward: 25000, link: 'https://www.effectivegatecpm.com/xtip8ppfm?key=2ad0dd2e93d9548de0bb63de28d31a7d' },
    { id: 2, reward: 15000, link: 'https://otieu.com/4/6071291' },
    { id: 3, reward: 15000, link: 'https://otieu.com/4/6363819' },
    { id: 4, reward: 10000, link: 'https://otieu.com/4/6363813' },
].map((task, index) => ({ ...task, title: shuffleArray([...taskTitles])[index] }));


const partnershipTasks = [
    { id: 5, title: 'Partner with Adsterra', link: 'https://beta.publishers.adsterra.com/referral/6iKFPXUy1L' },
    { id: 6, title: 'Partner with Monetag', link: 'https://monetag.com/?ref_id=nZG4' },
]

export default function TasksPage() {
    const handleGo = (link) => {
        window.open(link, '_blank');
    };

    return (
        <>
            <div className="flex flex-col items-center min-h-screen p-4">
                <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Task Center</h1>
                
                <div className="w-full max-w-md space-y-4">
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
                    
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl flex justify-between items-center opacity-50 cursor-not-allowed">
                        <div>
                            <h3 className="font-semibold text-lg">Watch Video Ads</h3>
                            <p className="text-yellow-400 font-bold">+5,000 Coins</p>
                        </div>
                        <button disabled className="bg-gray-600 text-white font-bold py-2 px-5 rounded-lg">
                            Upcoming
                        </button>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-300 pt-6 mb-2">Partnerships</h2>
                     {partnershipTasks.map(task => (
                        <div key={task.id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl flex justify-between items-center transition-all hover:border-green-500 hover:scale-105">
                             <h3 className="font-semibold text-lg">{task.title}</h3>
                            <button onClick={() => handleGo(task.link)} className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-2 px-5 rounded-lg">
                                Visit
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav />
        </>
    );
}