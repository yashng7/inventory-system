import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Alert = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const icons = {
    success: <FiCheckCircle className="w-5 h-5" />,
    error: <FiAlertCircle className="w-5 h-5" />,
    warning: <FiAlertCircle className="w-5 h-5" />,
    info: <FiInfo className="w-5 h-5" />,
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 flex items-center justify-between ${styles[type]}`}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="font-medium">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70">
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;