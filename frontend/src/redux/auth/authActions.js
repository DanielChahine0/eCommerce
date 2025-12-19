import { api, setAuthToken as setApiToken } from '../../api/api';
import * as types from './authActionTypes';

// Login Action
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: types.LOGIN_REQUEST });
  
  try {
    const response = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    const token = response.token;
    localStorage.setItem('authToken', token);
    setApiToken(token);
    
    dispatch({
      type: types.LOGIN_SUCCESS,
      payload: { user: response.user, token },
    });
    
    return response;
  } catch (error) {
    dispatch({
      type: types.LOGIN_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Register Action
export const register = (userData) => async (dispatch) => {
  dispatch({ type: types.REGISTER_REQUEST });
  
  try {
    const response = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token
    const token = response.token;
    localStorage.setItem('authToken', token);
    setApiToken(token);
    
    dispatch({
      type: types.REGISTER_SUCCESS,
      payload: { user: response.user, token },
    });
    
    return response;
  } catch (error) {
    dispatch({
      type: types.REGISTER_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Logout Action
export const logout = () => (dispatch) => {
  localStorage.removeItem('authToken');
  setApiToken(null);
  
  dispatch({ type: types.LOGOUT });
};

// Set Auth Token (for app initialization)
export const setAuthToken = (token) => (dispatch) => {
  if (token) {
    setApiToken(token);
    dispatch({
      type: types.SET_AUTH_TOKEN,
      payload: token,
    });
  }
};

// Clear Auth Error
export const clearAuthError = () => (dispatch) => {
  dispatch({ type: types.CLEAR_AUTH_ERROR });
};
