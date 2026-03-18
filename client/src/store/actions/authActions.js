import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
	setauthloading,
	setauthsuccess,
	setautherror,
	clearuser,
} from '../reducers/authSlice';

const extractdata = (responseData) => responseData?.data || responseData;

export const asyncregisteruser = (payload) => async (dispatch) => {
	try {
		dispatch(setauthloading());
		const { data } = await api.post('/auth/register', payload);
		const authdata = extractdata(data);
		if (authdata?.token) {
			localStorage.setItem('token', authdata.token);
		}
		dispatch(setauthsuccess(authdata));
		toast.success('Registration successful');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Registration failed';
		dispatch(setautherror(message));
		toast.error(message);
		return false;
	}
};

export const asyncloginuser = (payload) => async (dispatch) => {
	try {
		dispatch(setauthloading());
		const { data } = await api.post('/auth/login', payload);
		const authdata = extractdata(data);
		if (authdata?.token) {
			localStorage.setItem('token', authdata.token);
		}
		dispatch(setauthsuccess(authdata));
		toast.success('Login successful');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Login failed';
		dispatch(setautherror(message));
		toast.error(message);
		return false;
	}
};

export const asyncloaduser = () => async (dispatch) => {
	try {
		dispatch(setauthloading());
		const { data } = await api.get('/auth/me');
		dispatch(setauthsuccess(extractdata(data)));
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to load user';
		dispatch(setautherror(message));
		return false;
	}
};

export const asyncforgotpassword = (payload) => async (dispatch) => {
	try {
		dispatch(setauthloading());
		await api.post('/auth/forgot-password', payload);
		toast.success('Reset link sent if email exists');
		dispatch(setauthsuccess({ user: null }));
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to process forgot password';
		dispatch(setautherror(message));
		toast.error(message);
		return false;
	}
};

export const asyncresetpassword = (token, payload) => async (dispatch) => {
	try {
		dispatch(setauthloading());
		const { data } = await api.post(`/auth/reset-password/${token}`, payload);
		const authdata = extractdata(data);
		if (authdata?.token) {
			localStorage.setItem('token', authdata.token);
		}
		dispatch(setauthsuccess(authdata));
		toast.success('Password reset successful');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to reset password';
		dispatch(setautherror(message));
		toast.error(message);
		return false;
	}
};

export const asyncchangepassword = (payload) => async (dispatch) => {
	try {
		dispatch(setauthloading());
		const { data } = await api.post('/auth/change-password', payload);
		const authdata = extractdata(data);
		if (authdata?.token) {
			localStorage.setItem('token', authdata.token);
		}
		dispatch(setauthsuccess(authdata));
		toast.success('Password changed successfully');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to change password';
		dispatch(setautherror(message));
		toast.error(message);
		return false;
	}
};

export const asyncoauthlogin = (payload) => async (dispatch) => {
	try {
		dispatch(setauthloading());
		const { data } = await api.post('/auth/oauth', payload);
		const authdata = extractdata(data);
		if (authdata?.token) {
			localStorage.setItem('token', authdata.token);
		}
		dispatch(setauthsuccess(authdata));
		toast.success('Login successful');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'OAuth login failed';
		dispatch(setautherror(message));
		toast.error(message);
		return false;
	}
};

export const asynclogoutuser = () => async (dispatch) => {
	localStorage.removeItem('token');
	dispatch(clearuser());
	toast.success('Logged out successfully');
	return true;
};
