import axios from 'axios';

import { alertError, alertSuccess } from '../../utils/feedback';
import { LOGIN, LOGOUT } from '../types/userTypes';
import { requestFailed, requestStarted, requestSucceeded } from './feedbackActionCreators';

export const login = (user, token) => ({ type: LOGIN, payload: { user, token } });

export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return { type: LOGOUT }
};


export const requestLogin = (email, password) => {
    return async (dispatch) => {
        dispatch(requestStarted())
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password })
            dispatch(requestSucceeded())
            const { message, token, user } = res.data
            alertSuccess(message)
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            dispatch(login(user, token))
        } catch (err) {
            let errorMessage = err.message || 'Request failed'
            if (err && err.response && err.response.data && err.response.data.error && typeof(err.response.data.error) === 'string') {
                errorMessage = err.response.data.error
            }
            if (err && err.response && err.response.data && err.response.data.error && err.response.data.error.details) {
                errorMessage =  err.response.data.error.details[0] && err.response.data.error.details[0].message
            }
            dispatch(requestFailed(errorMessage))
        }
    }
}