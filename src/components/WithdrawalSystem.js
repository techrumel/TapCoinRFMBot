'use client';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// --- Notun Logic ---
const MIN_WITHDRAW_COINS = 20000000; // 20 Million coins ($20 USD)
const COINS_PER_DOLLAR = 1000000; // 1 Million coins

const WithdrawalSystem = ({ totalScore }) => { // <-- Prop 'referralCount' theke 'totalScore' kora hoyeche
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initData, setInitData] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);
    
    // Calculate current earnings
    const currentDollars = (totalScore / COINS_PER_DOLLAR).toFixed(2);
    const hasEnoughCoins = totalScore >= MIN_WITHDRAW_COINS;

    // Telegram auth data load koro
    useEffect(() => {
        const tg = globalThis.Telegram?.WebApp;
        if (tg && tg.initData) {
            tg.ready();
            setInitData(tg.initData);
        }
    }, []);

    // (Ekhane 'savePhoneNumberToServer' function-ta thakbe, jodi age add kore thako)

    // --- Updated Function: Withdraw Button Click ---
    const handleWithdrawClick = () => {
        if (!hasEnoughCoins) {
            alert(`You need at least ${MIN_WITHDRAW_COINS.toLocaleString()} coins ($20) to withdraw. You currently have ${totalScore.toLocaleString()} coins ($${currentDollars}).`);
            return;
        }

        const tg = globalThis.Telegram?.WebApp;
        if (!tg) {
            alert("Please open this app inside Telegram to withdraw.");
            return;
        }

        setIsRequesting(true);

        // --- Telegram-er kache Phone Number Chao ---
        tg.requestContact(async (isShared) => {
            if (isShared) {
                // User permission diyeche
                console.log("Contact shared!");
                
                // (Ekhane number save korar logic thakte pare)
                
                // Ekhon modal open koro
                setIsModalOpen(true);
                
            } else {
                // User "Cancel" click koreche
                alert("You must share your contact to withdraw.");
            }
            setIsRequesting(false);
        });
    };

    return (
        <>
            <div className="w-full text-center mt-4">
                {/* --- Notun Text --- */}
                <p className={`mb-2 font-bold ${hasEnoughCoins ? 'text-green-400' : 'text-yellow-400'}`}>
                    Coins: {totalScore.toLocaleString()} / {MIN_WITHDRAW_COINS.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                    Current Value: ${currentDollars} USD
                </p>
                
                <button
                    onClick={handleWithdrawClick}
                    disabled={!hasEnoughCoins || isRequesting || !initData}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-3 px-4 rounded-lg text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRequesting ? 'Requesting...' : 'Withdraw Funds'}
                </button> {/* <-- TYPO FIX KORA HOYECHE: </D_button> -> </button> */}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
                    <div className="bg-gray-800 border border-cyan-500 rounded-2xl p-6 max-w-sm w-full mx-4">
                        <h2 className="text-2xl font-bold mb-4 text-cyan-300">Withdrawal Instructions</h2>
                        
                        {/* --- Notun Instructions --- */}
                        <div className="text-left space-y-3 text-gray-300">
                            <p className='text-white text-lg'>Your Balance: ${currentDollars} USD</p>
                            <ul className="list-disc list-inside text-sm pl-2">
                                <li>Rate: 1,000,000 Coins = $1 USD</li>
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
    totalScore: PropTypes.number.isRequired, // <-- Prop name update kora hoyeche
};

export default WithdrawalSystem;