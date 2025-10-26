'use client';
import { useState, useEffect } from 'react';
import BottomNav from '../../components/BottomNav';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Helper to get rank icon
  const getRankIcon = (index) => {
    if (index === 0) return '🥇'; // 1st
    if (index === 1) return '🥈'; // 2nd
    if (index === 2) return '🥉'; // 3rd
    return `#${index + 1}`; // 4th, 5th...
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen p-4 pb-24">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Leaderboard</h1>
        
        <div className="w-full max-w-md space-y-3">
          {isLoading && (
            <p className="text-center text-gray-400 text-lg animate-pulse">Loading Rankings...</p>
          )}

          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}

          {!isLoading && !error && (
            leaderboard.map((user, index) => (
              <div 
                key={user.id} 
                className={`bg-gray-800 border border-gray-700 p-4 rounded-xl flex items-center transition-all 
                  ${index === 0 ? 'border-yellow-400 shadow-lg' : ''}
                  ${index === 1 ? 'border-gray-400 shadow-md' : ''}
                  ${index === 2 ? 'border-orange-600 shadow-sm' : ''}
                `}
              >
                {/* Rank */}
                <div className="text-xl font-bold w-12 text-center">
                  {getRankIcon(index)}
                </div>
                
                {/* User Info */}
                <div className="flex-1 ml-4">
                  <h3 className="font-semibold text-lg text-white truncate">
                    {user.username}
                  </h3>
                  <p className="text-yellow-400 font-bold">
                    {user.score.toLocaleString()} Coins
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}