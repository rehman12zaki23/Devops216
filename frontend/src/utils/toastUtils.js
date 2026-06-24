import toast from 'react-hot-toast';

// Keep track of shown toasts to prevent duplicates
const shownToasts = new Set();
const toastTimeout = 3000; // 3 seconds

const createUniqueToast = (type, message, options = {}) => {
  const toastKey = `${type}_${message}`;
  
  // If this exact toast was already shown recently, don't show it again
  if (shownToasts.has(toastKey)) {
    return;
  }
  
  // Add to shown toasts
  shownToasts.add(toastKey);
  
  // Remove from set after timeout
  setTimeout(() => {
    shownToasts.delete(toastKey);
  }, toastTimeout);
  
  // Show the toast
  return toast[type](message, options);
};

export const uniqueToast = {
  success: (message, options) => createUniqueToast('success', message, options),
  error: (message, options) => createUniqueToast('error', message, options),
  info: (message, options) => createUniqueToast('success', message, options), // Use success for info
  loading: (message, options) => createUniqueToast('loading', message, options),
};

export default uniqueToast;
