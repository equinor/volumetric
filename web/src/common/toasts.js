import { toast } from 'react-toastify';

export const errorToast = message =>
  toast(message, {
    hideProgressBar: true,
    type: toast.TYPE.ERROR,
  });
