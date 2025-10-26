// src/app/tasks/page.js
'use client'; // Client Component কারণ এখানে state এবং event handler (onClick) আছে

import Link from 'next/link';
import { useState } from 'react'; // টাস্কের স্টেট ম্যানেজ করার জন্য

// ডেমো টাস্কের তালিকা
const initialTasks = [
    { id: 1, title: 'Join our Telegram Channel', reward: 5000, completed: false, link: 'https://t.me/YourChannel' },
    { id: 2, title: 'Follow us on X (Twitter)', reward: 5000, completed: false, link: 'https://twitter.com/YourProfile' },
    { id: 3, title: 'Subscribe to our YouTube', reward: 7000, completed: false, link: 'https://youtube.com/YourChannel' },
    { id: 4, title: 'Invite 3 Friends', reward: 10000, completed: false, link: null }, // এর জন্য আলাদা লজিক লাগবে
];

// এটাই হলো React কম্পোনেন্ট যা ডিফল্ট হিসেবে এক্সপোর্ট করতে হবে
export default function TasksPage() {
    const [tasks, setTasks] = useState(initialTasks);

    const handleClaim = (taskId) => {
        // প্রোডাকশনে, সার্ভারে ভেরিফাই করতে হবে যে টাস্কটি সত্যি সম্পন্ন হয়েছে কিনা
        alert(`Claiming reward for task ${taskId}. (This is a demo)`);
        
        // UI-তে টাস্কটিকে completed হিসেবে দেখানোর জন্য state আপডেট করুন
        setTasks(currentTasks => 
            currentTasks.map(task => 
                task.id === taskId ? { ...task, completed: true } : task
            )
        );
    };

    const handleGo = (link) => {
        if (link) {
            window.open(link, '_blank');
        } else {
            alert('Please go back to the main page to use your referral link.');
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4 font-sans">
            <h1 className="text-3xl font-bold mb-6">Tasks & Rewards</h1>
            
            <div className="w-full max-w-md space-y-4">
                {tasks.map(task => (
                    <div key={task.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center gap-2">
                        <div className='flex-grow'>
                            <h2 className="font-semibold">{task.title}</h2>
                            <p className="text-yellow-400">+{task.reward.toLocaleString()} Coins</p>
                        </div>
                        <div className="flex flex-col gap-2">
                             <button 
                                onClick={() => handleGo(task.link)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-4 rounded text-sm"
                            >
                                Go
                            </button>
                            <button 
                                onClick={() => handleClaim(task.id)}
                                className={`font-bold py-1 px-4 rounded text-sm ${task.completed ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                                disabled={task.completed}
                            >
                                {task.completed ? 'Claimed' : 'Claim'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Link href="/" className="mt-8 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded">
                Back to Game
            </Link>
        </div>
    );
}