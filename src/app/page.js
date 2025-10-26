'use client';
import { useState, useEffect, useCallback } from 'react';
import BottomNav from '../components/BottomNav';
import AdBanner from '../components/AdBanner';
import LuckyWheel from '../components/LuckyWheel';
import WithdrawalSystem from '../components/WithdrawalSystem';

const GAME_DURATION = 60; // 1 Minute
const MAX_ENERGY = 10;
const ENERGY_REGENERATION_TIME = 30 * 60 * 1000; // 30 minutes in ms

export default function HomePage() {
  // Fix: Initialize with default values for server-side rendering
  const [totalScore, setTotalScore] = useState(0);
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [lastEnergyRegeneration, setLastEnergyRegeneration] = useState(() => Date.now());
  
  const [sessionScore, setSessionScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  
  const [referralCount, setReferralCount] = useState(0);
  const [referralLink, setReferralLink] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const [flyingNumbers, setFlyingNumbers] = useState([]);
  const [showWheel, setShowWheel] = useState(false);

  // Initialize Telegram AND Load localStorage data on Client-Side
  useEffect(() => {
    // --- FIX: Load localStorage data only on the client ---
    // This code will only run in the browser, not on the server
    const savedScore = Number(localStorage.getItem('totalScore')) || 0;
    const savedEnergy = Number(localStorage.getItem('energy')) || MAX_ENERGY;
    const savedRegen = Number(localStorage.getItem('lastEnergyRegeneration')) || Date.now();

    setTotalScore(savedScore);
    setEnergy(savedEnergy);
    setLastEnergyRegeneration(savedRegen);
    // --- End of Fix ---

    // --- Existing Telegram/Dev Logic ---
    let currentUser;
    if (globalThis.Telegram?.WebApp && globalThis.Telegram.WebApp.initDataUnsafe?.user) {
      // --- PRODUCTION (Inside Telegram) ---
      console.log("Running inside Telegram.");
      const tg = globalThis.Telegram.WebApp;
      tg.ready();
      tg.expand();
      currentUser = tg.initDataUnsafe.user;
      
      // Fetch real referral count here
      // fetch(`/api/referral?userId=${currentUser.id}`).then(res => res.json()).then(data => {
      //   setReferralCount(data.count); 
      // });
      
    } else {
      // --- DEVELOPMENT (Outside Telegram) ---
      console.warn("Telegram WebApp data not found. Running in development mode.");
      currentUser = { id: 123456789, first_name: "Dev", last_name: "User" };
      setReferralCount(5); 
    }

    if (currentUser) {
      const refLink = `https://t.me/TapcoinRMFBOT/tapcoin?startapp=ref_${currentUser.id}`;
      setReferralLink(refLink);
    }
    
  }, []); // Empty dependency array ensures this runs only once on load (on client)

  // Save state to localStorage
  useEffect(() => {
    // This effect will also only run on the client, so localStorage is safe here
    localStorage.setItem('totalScore', totalScore);
    localStorage.setItem('energy', energy);
    localStorage.setItem('lastEnergyRegeneration', lastEnergyRegeneration);
  }, [totalScore, energy, lastEnergyRegeneration]);
  
  // Energy Regeneration Logic
  useEffect(() => {
      const regenerationInterval = setInterval(() => {
          if(energy < MAX_ENERGY) {
              const now = Date.now();
              if (now - lastEnergyRegeneration > ENERGY_REGENERATION_TIME) {
                  setEnergy(prev => Math.min(MAX_ENERGY, prev + 1));
                  setLastEnergyRegeneration(now);
              }
          }
      }, 60000); // Check every minute
      return () => clearInterval(regenerationInterval);
  }, [energy, lastEnergyRegeneration]);

  // Game Timer Logic
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) {
      if (gameState === 'playing' && timeLeft <= 0) {
        setGameState('finished');
        setTotalScore(prev => prev + sessionScore);
        if (sessionScore > 0) { 
            setShowWheel(true);
        }
      }
      return;
    }
    const timerInterval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerInterval);
  }, [gameState, timeLeft, sessionScore]);

  const startGame = () => {
    if (energy <= 0) {
      alert("You're out of energy! Please wait for it to recharge.");
      return;
    }
    setEnergy(prev => prev - 1);
    setSessionScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
  };
  
  const showFlyingNumber = useCallback((amount, isBonus) => {
    const id = Date.now() + Math.random();
    const newNumber = { id, amount, isBonus, x: Math.random() * 50 + 25, y: Math.random() * 20 + 40 };
    setFlyingNumbers(current => [...current, newNumber]);
    setTimeout(() => setFlyingNumbers(current => current.filter(n => n.id !== id)), 1000);
  }, []);

  const handleTap = () => {
    if (gameState !== 'playing') return;
    let scoreToAdd = 1;
    let isBonus = false;
    if (Math.random() < 0.05) { // 5% lucky chance
      scoreToAdd = Math.floor(Math.random() * 50) + 10;
      isBonus = true;
    }
    setSessionScore(prev => prev + scoreToAdd);
    showFlyingNumber(scoreToAdd, isBonus);
  };

  const handleSpinEnd = (prize) => {
      setShowWheel(false);
      if (typeof prize === 'number') {
          setTotalScore(prev => prev + prize);
          alert(`Congratulations! You won ${prize} extra coins!`);
      } else {
          alert('Better luck next time!');
      }
  };

  const handleCopyReferral = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess('Copied!');
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Failed');
    }
    setTimeout(() => setCopySuccess(''), 2000); // Reset message after 2s
  };

  const getButtonText = () => {
    if (gameState === 'playing') return `+${sessionScore}`;
    if (gameState === 'finished') return 'Retry';
    return 'Start';
  };

  return (
    <>
      {showWheel && <LuckyWheel onSpinEnd={handleSpinEnd} onClose={() => setShowWheel(false)} />}
      <div className="relative flex flex-col items-center justify-between min-h-screen p-4 text-center overflow-hidden">
        {/* Flying numbers */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {flyingNumbers.map(num => (
            <span key={num.id} className={`flying-number absolute font-bold drop-shadow-lg ${num.isBonus ? 'text-4xl text-pink-400' : 'text-2xl text-yellow-300'}`} style={{ left: `${num.x}%`, top: `${num.y}%` }}>
              +{num.amount}
            </span>
          ))}
        </div>
        
        {/* Top Section: Score and Energy */}
        <div className="w-full max-w-sm">
            <AdBanner adKey="d229a298f12c0c653e1d0c97f68a077c" format="iframe" height={50} width={320} />
            
            <div className="flex justify-between items-center mb-1 mt-4">
                <span className='font-bold'>Energy</span>
                <span className='font-bold'>{energy}/{MAX_ENERGY}</span>
            </div>
            <div className="w-full h-4 rounded-full energy-bar-bg overflow-hidden">
                <div className="h-full rounded-full energy-bar-inner" style={{ width: `${(energy / MAX_ENERGY) * 100}%` }}></div>
            </div>
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 drop-shadow-lg mt-4">{totalScore.toLocaleString()}</h1>
        </div>

        {/* Middle Section: Game */}
        <div className="flex flex-col items-center justify-center my-6 z-20">
          <button
            type="button"
            className={`w-64 h-64 md:w-72 md:h-72 rounded-full flex items-center justify-center cursor-pointer select-none relative ${gameState === 'playing' ? '' : 'coin-pulse'} p-0 border-none bg-transparent`}
            onClick={gameState === 'playing' ? handleTap : startGame}
          >
            <div className='absolute inset-0 bg-gradient-to-b from-yellow-300 to-orange-500 rounded-full'></div>
            <span className="relative text-5xl font-extrabold text-white" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.6)' }}>
              {getButtonText()}
            </span>
          </button>
          {gameState === 'playing' && <div className="mt-4 text-4xl font-bold text-white">Time: {timeLeft}s</div>}
          {gameState === 'finished' && (
              <div className="mt-4 text-2xl font-bold text-yellow-400">Session Score: {sessionScore.toLocaleString()}!</div>
          )}
        </div>
        
        {/* --- Referral Link Section --- */}
        {referralLink && (
          <div className="w-full max-w-sm my-4 z-20">
            <p className="text-lg font-bold mb-2 text-white">Invite Friends & Earn!</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 text-sm"
              />
              <button
                onClick={handleCopyReferral}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-24"
              >
                {copySuccess || 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Section: Ads & Withdrawal */}
        <div className="w-full max-w-sm z-20">
           <AdBanner adKey="d229a298f12c0c653e1d0c97f68a077c" format="iframe" height={50} width={320} />
           <WithdrawalSystem referralCount={referralCount} />
        </div>
      </div>
      <BottomNav />

      <style jsx global>{`
        .energy-bar-bg {
          background-color: #374151; /* gray-700 */
        }
        .energy-bar-inner {
          background: linear-gradient(to right, #2dd4bf, #06b6d4); /* teal-400 to cyan-500 */
          transition: width 0.3s ease-in-out;
        }
        .flying-number {
          opacity: 1;
          transition: transform 1s ease-out, opacity 1s ease-out;
          transform: translateY(0);
          animation: fly-up 1s ease-out forwards;
        }
        @keyframes fly-up {
          to {
            transform: translateY(-80px);
            opacity: 0;
          }
        }
        .coin-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}