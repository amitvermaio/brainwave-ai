import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
	setdocumentloading,
	setdocuments,
	setcurrentdocument,
	setdocumenterror,
} from '../reducers/documentSlice';

const extractdata = (responseData) => responseData?.data || responseData;

export const asyncuploaddocument = (payload) => async (dispatch) => {
	try {
		dispatch(setdocumentloading());
		const { data } = await api.post('/documents/upload', payload);
		const response = extractdata(data);
		const uploaded = response?.document;
		dispatch(setcurrentdocument(uploaded || null));
		toast.success('Document uploaded successfully');
		return uploaded;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to upload document';
		dispatch(setdocumenterror(message));
		toast.error(message);
		return null;
	}
};

export const asyncgetdocuments = () => async (dispatch) => {
	try {
		dispatch(setdocumentloading());
		const { data } = await api.get('/documents');
		const response = extractdata(data);
		dispatch(setdocuments(response?.documents || []));
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to fetch documents';
		dispatch(setdocumenterror(message));
		toast.error(message);
		return false;
	}
};

export const asyncgetdocumentbyid = (id) => async (dispatch) => {
	try {
		dispatch(setdocumentloading());
		const { data } = await api.get(`/documents/${id}`);
		const response = extractdata(data);
		dispatch(setcurrentdocument(response?.document || null));
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to fetch document';
		dispatch(setdocumenterror(message));
		toast.error(message);
		return false;
	}
};

export const asyncupdatedocument = (id, payload) => async (dispatch) => {
	try {
		dispatch(setdocumentloading());
		const { data } = await api.put(`/documents/${id}`, payload);
		const response = extractdata(data);
		dispatch(setcurrentdocument(response?.document || null));
		toast.success('Document updated successfully');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to update document';
		dispatch(setdocumenterror(message));
		toast.error(message);
		return false;
	}
};

export const asyncdeletedocument = (id) => async (dispatch) => {
	try {
		dispatch(setdocumentloading());
		await api.delete(`/documents/${id}`);
		dispatch(asyncgetdocuments());
		toast.success('Document deleted successfully');
		return true;
	} catch (error) {
		const message = error.response?.data?.message || 'Failed to delete document';
		dispatch(setdocumenterror(message));
		toast.error(message);
		return false;
	}
};
