import { toast } from 'react-toastify';

export const useToast = () => {
    const notify = (message, options = {}) => {
        toast(message, options);
    };

    return notify;
};