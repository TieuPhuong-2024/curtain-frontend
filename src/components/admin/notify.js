import { toast } from 'react-toastify';

const options = {
  className: 'a-toast',
  position: 'bottom-right',
  autoClose: 3500,
  closeOnClick: true,
  pauseOnHover: true,
};

export const notify = {
  success: (message) => toast.success(message, options),
  error: (message) => toast.error(message, options),
  info: (message) => toast.info(message, options),
};
