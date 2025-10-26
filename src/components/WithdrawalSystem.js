'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';

const WithdrawalSystem = ({ referralCount }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const requiredReferrals = 10;

    const handleWithdrawClick = () => {
        if (referralCount >= requiredReferrals) {
            setIsModalOpen(true);
        } else {
            alert(`You need at least ${requiredReferrals} referrals to proceed. You currently have ${referralCount}.`);
        }
    };

    return (
        <>
            <div className="w-full text-center mt-4">
                <p className={`mb-2 font-bold ${referralCount >= requiredReferrals ? 'text-green-400' : 'text-yellow-400'}`}>
                    Referrals: {referralCount} / {requiredReferrals}
                </p>
                <button
                    onClick={handleWithdrawClick}
                    disabled={referralCount < requiredReferrals}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-3 px-4 rounded-lg text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Withdraw Funds
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
                    <div className="bg-gray-800 border border-cyan-500 rounded-2xl p-6 max-w-sm w-full mx-4">
                        <h2 className="text-2xl font-bold mb-4 text-cyan-300">Withdrawal Instructions</h2>
                        <div className="text-left space-y-3 text-gray-300">
                            <p><strong className="text-white">Step 1:</strong> Click the button below to join our official Telegram Group.</p>
                            <p><strong className="text-white">Step 2:</strong> In the group, post a screenshot of your game homepage showing your referral count.</p>
                            <p><strong className="text-white">Step 3:</strong> Clearly state your desired payment method in your message.</p>
                        </div>
                        <div className="mt-6">
                            <h3 className="font-bold text-lg mb-2 text-white">Available Payment Methods:</h3>
                            <ul className="list-disc list-inside text-gray-300">
                                <li>PayPal</li>
                                <li>Payoneer</li>
                                <li className="opacity-50">Bkash (Upcoming)</li>
                                <li className="opacity-50">Nagad (Upcoming)</li>
                            </ul>
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
};

export default WithdrawalSystem;