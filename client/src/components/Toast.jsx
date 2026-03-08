import toast from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (message, duration) => toast.success(message, { duration }),
    error: (message, duration) => toast.error(message, { duration }),
    info: (message, duration) => toast(message, { duration }),
    warning: (message, duration) => toast(message, { icon: '⚠️', duration })
  };
};

export default useToast;
