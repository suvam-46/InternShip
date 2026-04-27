import { useEffect, useState } from 'react';
import './Toast.css';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
};

const Toast = ({ message, type = 'success' }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2700);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
