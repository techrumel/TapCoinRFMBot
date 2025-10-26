// src/components/LuckyWheel.js
'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';

const segments = [
    { value: 100, label: '100', color: '#6366f1' },
    { value: 500, label: '500', color: '#8b5cf6' },
    { value: 50, label: '50', color: '#ec4899' },
    { value: 1000, label: '1K', color: '#f59e0b' },
    { value: 'Try Again', label: ':(', color: '#4b5563' },
    { value: 200, label: '200', color: '#10b981' },
];
const segmentAngle = 360 / segments.length;

const LuckyWheel = ({ onSpinEnd, onClose }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [finalRotation, setFinalRotation] = useState(0);

    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);

        const randomSegmentIndex = Math.floor(Math.random() * segments.length);
        const prize = segments[randomSegmentIndex];
        
        // Calculate stop angle
        const stopAngle = (360 - (randomSegmentIndex * segmentAngle)) - (segmentAngle / 2);
        const totalRotation = 360 * 5 + stopAngle; // 5 full spins + stop angle
        setFinalRotation(totalRotation);
        
        setTimeout(() => {
            onSpinEnd(prize.value);
            setIsSpinning(false);
        }, 4500); // Wait for animation to finish
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
            <div className="bg-gray-800 border border-purple-500 rounded-2xl p-6 text-center shadow-xl">
                <h2 className="text-3xl font-bold mb-4 text-yellow-300">Lucky Wheel</h2>
                <div className="relative w-64 h-64 mx-auto mb-6">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] text-5xl z-10">▼</div>
                    <div
                        className="wheel w-full h-full rounded-full border-4 border-yellow-400 overflow-hidden"
                        style={{ transform: `rotate(${finalRotation}deg)`, transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none' }}
                    >
                        {segments.map((segment, index) => (
                            <div
                                key={index}
                                className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center"
                                style={{
                                    transform: `rotate(${index * segmentAngle}deg)`,
                                    clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                                    backgroundColor: segment.color,
                                }}
                            >
                                <span className="text-white font-bold text-xl" style={{ transform: `rotate(210deg) translate(-50%, 10px)` }}>
                                    {segment.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg disabled:opacity-50"
                >
                    {isSpinning ? 'Spinning...' : 'Spin!'}
                </button>
                 <button onClick={onClose} className="mt-4 text-gray-400 text-sm">Close</button>
            </div>
        </div>
    );
};

LuckyWheel.propTypes = {
    onSpinEnd: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default LuckyWheel;