import React from 'react';
import { toast, ToastContainer, IconProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AlertCircle, CheckCircle, Info, Bell } from 'lucide-react';

// Define custom styles for different toast types
const toastStyles = {
  error: {
    style: {
      background: '#FEE2E2',
      color: '#991B1B',
      borderLeft: '4px solid #DC2626',
    },
    icon: <AlertCircle size={24} color="#DC2626" />,
  },
  success: {
    style: {
      background: '#D1FAE5',
      color: '#065F46',
      borderLeft: '4px solid #059669',
    },
    icon: <CheckCircle size={24} color="#059669" />,
  },
  info: {
    style: {
      background: '#E0F2FE',
      color: '#075985',
      borderLeft: '4px solid #0284C7',
    },
    icon: <Info size={24} color="#0284C7" />,
  },
  announcement: {
    style: {
      background: '#F3E8FF',
      color: '#6B21A8',
      borderLeft: '4px solid #7C3AED',
    },
    icon: <Bell size={24} color="#7C3AED" />,
  },
};

// Custom toast component
const CustomToast: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ marginRight: '12px' }}>{icon}</div>
    <div>{children}</div>
  </div>
);

// Toast functions
const createToast = (type: keyof typeof toastStyles, message: string) => {
  const { style, icon } = toastStyles[type];
  toast(<CustomToast icon={icon}>{message}</CustomToast>, {
    style: {
      ...style,
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      fontFamily: '"Inter", sans-serif',
      fontSize: '14px',
      fontWeight: 500,
    },
  });
};

const notifyError = (message: string) => createToast('error', message);
const notifySuccess = (message: string) => createToast('success', message);
const notifyInfo = (message: string) => createToast('info', message);
const notifyAnnouncement = (message: string) => createToast('announcement', message);

// Custom ToastContainer wrapper
const ToastContainerWrapper = () => (
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    style={{
      zIndex: 9999,
      top: '1rem',
      right: '1rem',
    }}
    toastStyle={{
      marginBottom: '1rem',
      padding: '16px',
      minHeight: '64px',
      width: '320px',
    }}
  />
);

export const ToastLib = {
  notifyError,
  notifySuccess,
  notifyInfo,
  notifyAnnouncement,
  ToastContainerWrapper,
};