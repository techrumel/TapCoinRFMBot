'use client';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// --- Notun Logic ---
const REQUIRED_REFERRALS = 10;
const COINS_PER_DOLLAR = 1000000; // 1 Million coins

const WithdrawalSystem = ({ referralCount, totalScore }) => { // <-- Duto prop-i neya hocche
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initData, setInitData] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);
    
    // Check korbe referral requirement
    const hasEnoughReferrals = referralCount >= REQUIRED_REFERRALS;
    
    // Calculate current earnings
    const currentDollars = (totalScore / COINS_PER_DOLLAR).toFixed(2);

    useEffect(() => {
        const tg = globalThis.Telegram?.WebApp;
        if (tg && tg.initData) {
            tg.ready();
            setInitData(tg.initData);
        }
    }, []);

    // ... (savePhoneNumberToServer function jodi age add kore thako, ta ekhane thakbe)

    const handleWithdrawClick = () => {
        // --- Logic Change ---
        if (!hasEnoughReferrals) {
            alert(`You need at least ${REQUIRED_REFERRALS} referrals to withdraw. You currently have ${referralCount}.`);
            return;
        }

        const tg = globalThis.Telegram?.WebApp;
        if (!tg) {
            alert("Please open this app inside Telegram to withdraw.");
            return;
        }

        setIsRequesting(true);

        tg.requestContact(async (isShared) => {
            if (isShared) {
                console.log("Contact shared!");
                // (Ekhane number save korar logic thakte pare)
                setIsModalOpen(true);
            } else {
                alert("You must share your contact to withdraw.");
            }
            setIsRequesting(false);
        });
    };

    return (
        <>
            <div className="w-full text-center mt-4">
                {/* --- Notun UI --- */}
                <p className={`mb-2 font-bold ${hasEnoughReferrals ? 'text-green-400' : 'text-yellow-400'}`}>
                    Referrals: {referralCount} / {REQUIRED_REFERRALS}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                    Current Value: ${currentDollars} USD
                </p>
                
                <button
                    onClick={handleWithdrawClick}
                    disabled={!hasEnoughReferrals || isRequesting || !initData}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-3 px-4 rounded-lg text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRequesting ? 'Requesting...' : 'Withdraw Funds'}
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
                    <div className="bg-gray-800 border border-cyan-500 rounded-2xl p-6 max-w-sm w-full mx-4">
                        <h2 className="text-2xl font-bold mb-4 text-cyan-300">Withdrawal Instructions</h2>
                        
                        <div className="text-left space-y-3 text-gray-300">
                            <p className='text-white text-lg'>Your Balance: ${currentDollars} USD</p>
                            <ul className="list-disc list-inside text-sm pl-2">
                                <li>Rate: 1,000,000 Coins = $1 USD</li>
                                <li>Requirement: 10 Referrals (Completed)</li>
                                <li>Minimum Payout: $20 USD</li>
                            </ul>
                            <p className="text-white pt-2">Steps to Withdraw:</p>
                            <p><strong className="text-white">1.</strong> Join our Telegram Group (button below).</p>
                            <p><strong className="text-white">2.</strong> Post a screenshot of your game homepage.</p>
                            <p><strong className="text-white">3.</strong> State your payment method (PayPal, Payoneer) and email.</p>
                        </div>
                        
                        <div className="mt-6 flex flex-col gap-3">
                            <a href="https://t.me/RedMarkFiles" target="_blank" rel="noopener noreferrer" className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                Go to Telegram Group
                            </a>
                            <button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

WithdrawalSystem.propTypes = {
    referralCount: PropTypes.number.isRequired,
    totalScore: PropTypes.number.isRequired, // <-- Notun prop
};

export default WithdrawalSystem;