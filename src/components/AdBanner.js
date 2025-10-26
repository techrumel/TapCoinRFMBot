// src/components/AdBanner.js
'use client';
import Script from 'next/script';
import PropTypes from 'prop-types';

const AdBanner = ({ adKey, format, height, width }) => {
  const atOptions = {
    key: adKey,
    format: format,
    height: height,
    width: width,
    params: {},
  };

  return (
    <div className="flex justify-center my-4" style={{ minHeight: `${height}px` }}>
      <Script
        id={`adsterra-opts-${adKey}`}
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `atOptions = ${JSON.stringify(atOptions)};`,
        }}
      />
      <Script
        id={`adsterra-invoke-${adKey}`}
        strategy="lazyOnload"
        src={`//www.highperformanceformat.com/${adKey}/invoke.js`}
      />
    </div>
  );
};

AdBanner.propTypes = {
  adKey: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default AdBanner;