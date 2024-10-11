import React, { useState, useEffect } from 'react';

function Message({ type, children, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [children]);

  const handleDismiss = () => {
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      if (onDismiss) {
        onDismiss();
      }
    }, 300);
  };

  const getIcon = () => {
    return type === 'error' ? '❌' : '✅';
  };

  if (!visible) return null;

  return (
    <div 
      className={`message message-${type} ${fadeOut ? 'message-fade-out' : ''}`}
      onClick={handleDismiss}
    >
      <span className="message-icon">{getIcon()}</span>
      {children}
      <button className="message-close" onClick={handleDismiss}>×</button>
    </div>
  );
}

export default Message;
