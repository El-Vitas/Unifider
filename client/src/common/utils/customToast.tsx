import { toast } from 'react-toastify';

export const customToast = {
  success: (message: string) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  },
};
