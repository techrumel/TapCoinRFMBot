// src/components/WithdrawalSystem.js
'use client';
import { useState } from 'react';

const WithdrawalSystem = ({ currentScore, referralCount }) => {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const requiredReferrals = 10; // টাকা তোলার জন্য প্রয়োজনীয় রেফারেলের সংখ্যা

    const handleWithdraw = () => {
        if (referralCount < requiredReferrals) {
            setMessage(`টাকা তোলার জন্য আপনার ${requiredReferrals} জন রেফারেল প্রয়োজন। আপনার আছে ${referralCount} জন।`);
            return;
        }

        const numAmount = parseInt(amount, 10);
        if (!numAmount || numAmount <= 0) {
            setMessage('সঠিক পরিমাণ লিখুন।');
            return;
        }
        if (numAmount > currentScore) {
            setMessage('আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই।');
            return;
        }

        setMessage(`সাফল্য! আপনার ${numAmount.toLocaleString()} কয়েন উইথড্রলের অনুরোধ গ্রহণ করা হয়েছে।`);
        setAmount('');
    };

    return (
        <div className="w-full bg-gray-900 p-4 rounded-lg mt-4">
            <h3 className="text-xl font-bold text-center mb-2">Withdraw Coins</h3>
            <div className="text-center mb-3">
                <p className={referralCount >= requiredReferrals ? 'text-green-400' : 'text-yellow-400'}>
                    Referrals: {referralCount} / {requiredReferrals}
                </p>
            </div>
            {message && <p className="text-center text-orange-400 mb-2">{message}</p>}
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-2 rounded-md bg-gray-700 text-white border-0"
                disabled={referralCount < requiredReferrals}
            />
            <button
                onClick={handleWithdraw}
                className={`w-full text-white font-bold py-2 px-4 rounded-lg mt-2 ${referralCount < requiredReferrals ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-800'}`}
                disabled={referralCount < requiredReferrals}
            >
                Withdraw
            </button>
        </div>
    );
};

export default WithdrawalSystem;