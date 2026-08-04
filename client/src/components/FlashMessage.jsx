import React, { useEffect, useState } from 'react';

const FlashMessage = ({ type, message, onDismiss }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onDismiss, 400);
    }, 4600); // 5000ms total, starting fade at 4600ms

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!message) return null;

  const getEmoji = (msgType) => {
    switch (msgType) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const style = {
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    opacity: isFading ? 0 : 1,
    transform: isFading ? 'translateY(-12px)' : 'translateY(0)',
    animation: 'slideDown 0.3s ease-out forwards'
  };

  return (
    <div className={`alert alert-${type}`} role="alert" style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
        <span>
          <span style={{ marginRight: '8px' }}>{getEmoji(type)}</span>
          {message}
        </span>
        <button 
          onClick={() => { setIsFading(true); setTimeout(onDismiss, 400); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px' }}
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default FlashMessage;
