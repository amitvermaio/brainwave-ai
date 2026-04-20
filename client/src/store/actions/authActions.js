import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
	setauthloading,
	setauthsuccess,
	setautherror,
	setauthpendingverification,
	clearuser,
} from '../reducers/authSlice';

const extractdata = (responseData) => responseData?.data || responseData;

export const asyncregisteruser = (payload) => async (dispatch) => {
	try {
		dispatch(setauthloading());

		const { data } = await api.post('/auth/register', payload);
		const registerData = extractdata(data);

		const pendingEmail = registerData?.email || payload.email;

		if (pendingEmail) {
			localStorage.setItem('pendingVerificationEmail', pendingEmail);
		}

		dispatch(setauthpendingverification({ email: pendingEmail }));
		toast.success(data?.message || 'OTP sent to your email');
		return { success: true, email: pendingEmail };
	} catch (error) {
		const message = error.response?.data?.message || 'Registration failed';
		dispatch(setautherror(message));
		toast.error(message);
		return { success: false, email: null };
	}
};

export const asyncverifyregistrationotp = (payload) => async (dispatch) => {
	try {
		dispatch(setauthloading());
		const { data } = await api.post('/auth/verify-registration-otp', payload);
		const authdata = extractdata(data);

		if (authdata?.token) {
			localStorage.setItem('token', authdata.token);
		}
		localStorage.removeItem('pendingVerificationEmail');

		dispatch(setauthsuccess(authdata));
		toast.success(data?.message || 'Email verified successfully');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'OTP verification failed';
		dispatch(setautherror(message));
		toast.error(message);
		return false;
	}
};

export const asyncresendregistrationotp = (payload) => async (dispatch) => {
	try {
		dispatch(setauthloading());
		const { data } = await api.post('/auth/resend-registration-otp', payload);
		const pendingEmail = payload?.email?.trim()?.toLowerCase() || null;

		if (pendingEmail) {
			localStorage.setItem('pendingVerificationEmail', pendingEmail);
		}

		dispatch(setauthpendingverification({ email: pendingEmail }));
		toast.success(data?.message || 'A new OTP has been sent');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to resend OTP';
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
		localStorage.removeItem('pendingVerificationEmail');
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
		dispatch(setauthpendingverification({ email: null }));
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
		await api.post(`/auth/reset-password/${token}`, payload);
		localStorage.removeItem('token');
		localStorage.removeItem('pendingVerificationEmail');
		dispatch(clearuser());
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
		localStorage.removeItem('pendingVerificationEmail');
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
		localStorage.removeItem('pendingVerificationEmail');
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
	localStorage.removeItem('pendingVerificationEmail');
	dispatch(clearuser());
	toast.success('Logged out successfully');
	return true;
};
