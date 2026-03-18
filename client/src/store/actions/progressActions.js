import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
  setprogressloading,
  setdashboard,
  setprogresserror,
} from '../reducers/progressSlice';

const extractdata = (responseData) => responseData?.data || responseData;

export const asyncgetdashboard = () => async (dispatch) => {
  try {
    dispatch(setprogressloading());
    const { data } = await api.get('/progress/dashboard');
    dispatch(setdashboard(extractdata(data) || null));
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch dashboard';
    dispatch(setprogresserror(message));
    toast.error(message);
    return false;
  }
};
