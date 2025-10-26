'use client';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const WithdrawalSystem = ({ referralCount }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initData, setInitData] = useState(null); // Auth data save korar jonno
    const [isRequesting, setIsRequesting] = useState(false); // Button loading state
    
    const requiredReferrals = 10;

    // Telegram auth data load koro
    useEffect(() => {
        const tg = globalThis.Telegram?.WebApp;
        if (tg && tg.initData) {
            tg.ready();
            setInitData(tg.initData);
        }
    }, []);

    // --- Notun Function: Server-e Number Save Kora ---
    const savePhoneNumberToServer = async (phone) => {
      if (!initData) {
        alert("Authentication data not found. Please restart the app.");
        return;
      }
      try {
        // Amra user-er profile update korar jonno notun ekta API route use korbo
        const response = await fetch('/api/user/update-contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData, phone }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save phone number.');
        }
        
        console.log('Phone number saved successfully.');
        return true;

      } catch (error) {
        console.error('Error saving phone number:', error);
        alert(`Error: ${error.message}`);
        return false;
      }
    };

    // --- Updated Function: Withdraw Button Click ---
    const handleWithdrawClick = () => {
        if (referralCount < requiredReferrals) {
            alert(`You need at least ${requiredReferrals} referrals to proceed. You currently have ${referralCount}.`);
            return;
        }

        // Check if Telegram object ache
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
                
                // Amader Telegram WebApp script-er version check korte hoy
                let userPhone;
                if (tg.initDataUnsafe?.user?.phone) {
                   // Notun version-e ekhane phone number pawa jay
                   userPhone = tg.initDataUnsafe.user.phone;
                }
                
                // Pawa number-ta server-e save koro
                // Ekhon-o shob user-er phone pawa na gele, amra user-ke manually type korte bolbo
                // Kintu ekhon amra shudhu permission check korchi
                
                alert("Thank you for sharing your contact! We will verify your account.");
                
                // Ekhon-i modal open korar bodole user-ke bolte paro "Your number is saved"
                // Ekhane ami modal-tai open kore dichi
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
                <p className={`mb-2 font-bold ${referralCount >= requiredReferrals ? 'text-green-400' : 'text-yellow-400'}`}>
                    Referrals: {referralCount} / {requiredReferrals}
                </p>
                <button
                    onClick={handleWithdrawClick}
                    disabled={referralCount < requiredReferrals || isRequesting || !initData}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold py-3 px-4 rounded-lg text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRequesting ? 'Requesting...' : 'Withdraw Funds'}
                </D_button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
                    <div className="bg-gray-800 border border-cyan-500 rounded-2xl p-6 max-w-sm w-full mx-4">
                        <h2 className="text-2xl font-bold mb-4 text-cyan-300">Withdrawal Instructions</h2>
                        <p className='text-white mb-4'>Your account is being verified.</p>
                        <div className="text-left space-y-3 text-gray-300">
                            <p><strong className="text-white">Step 1:</strong> Click the button below to join our official Telegram Group.</p>
                            <p><strong className="text-white">Step 2:</strong> In the group, post a screenshot of your game homepage.</p>
                            <p><strong className="text-white">Step 3:</strong> State your desired payment method (PayPal, Payoneer).</p>
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