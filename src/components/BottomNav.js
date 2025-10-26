// src/components/BottomNav.js
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Simple SVG Icons for the navigation
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const TasksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;

const BottomNav = () => {
    const pathname = usePathname();

    const linkClasses = (path) => 
        `flex flex-col items-center justify-center flex-1 text-center py-2 transition-colors duration-300 ${
            pathname === path ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
        }`;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-70 backdrop-blur-md border-t border-gray-700 flex z-50">
            <Link href="/" className={linkClasses('/')}>
                <HomeIcon />
                <span className="text-xs">Home</span>
            </Link>
            <Link href="/tasks" className={linkClasses('/tasks')}>
                <TasksIcon />
                <span className="text-xs">Tasks</span>
            </Link>
        </nav>
    );
};

export default BottomNav;