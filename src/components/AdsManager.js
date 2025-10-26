// src/components/AdsManager.js
'use client';
import PropTypes from 'prop-types';
import Script from 'next/script';

const AdsManager = ({ type, zoneId }) => {
  if (type === 'adsterra_native_banner') {
    // Native Banner একটি নির্দিষ্ট div-এর মধ্যে লোড হয়
    // Adsterra ড্যাশবোর্ড থেকে পাওয়া কোড অনুযায়ী div-এর আইডি বা ক্লাস পরিবর্তন করুন
    return (
      <div id={`adsterra-native-${zoneId}`} className="w-full my-2 flex justify-center">
        {/* Adsterra Native Banner Code for zoneId will target this div */}
        <p className='text-xs text-gray-400'>Loading Native Ad...</p>
      </div>
    );
  }

  if (type === 'adsterra_social_bar') {
    // Social Bar কোনো UI রেন্ডার করে না, এটি একটি স্ক্রিপ্ট যা পুরো পেজে কাজ করে
    return (
      <Script
        id={`adsterra-social-bar-${zoneId}`}
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            // Adsterra Social Bar স্ক্রিপ্ট এখানে বসান (যদি প্রয়োজন হয়)
            // সাধারণত layout.js-এর স্ক্রিপ্টই যথেষ্ট
            console.log('Adsterra Social Bar activated for zone:', '${zoneId}');
          `
        }}
      />
    );
  }

  // Add more ad types here if needed

  return null;
};

AdsManager.propTypes = {
  type: PropTypes.string.isRequired,
  zoneId: PropTypes.string.isRequired,
};

export default AdsManager;