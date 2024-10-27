import React, { useEffect } from 'react';
import './AlertBox.css';

const AlertBox = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 1500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="alert-box">
      {message}
    </div>
  );
};

export default AlertBox;