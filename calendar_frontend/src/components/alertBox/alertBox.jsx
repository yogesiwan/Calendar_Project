import React, { useEffect } from 'react';
import "./alertBox.css";

const AlertBox = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 1500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert-box ${type}`}>
      {message}
    </div>
  );
};

export default AlertBox;