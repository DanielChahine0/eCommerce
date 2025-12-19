import { api } from '../../api/api';
import * as types from './userActionTypes';

// Fetch All Users (Admin)
export const fetchUsers = (auth) => async (dispatch) => {
  dispatch({ type: types.FETCH_USERS_REQUEST });

  try {
    // Accept either a raw jwt string or an object like { jwt }
    const jwt = typeof auth === 'string' ? auth : (auth && auth.jwt) ? auth.jwt : null;
    const options = jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : undefined;

    const users = await api('/api/users', options);

    dispatch({
      type: types.FETCH_USERS_SUCCESS,
      payload: users,
    });
    console.log('Users successfully fetched in action ---->', users);
    return users;
  } catch (error) {
    dispatch({
      type: types.FETCH_USERS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Fetch User Profile (Current User)
export const fetchUserProfile = () => async (dispatch) => {
  dispatch({ type: types.FETCH_USER_PROFILE_REQUEST });
  
  try {
    const user = await api('/api/users/profile');
    
    dispatch({
      type: types.FETCH_USER_PROFILE_SUCCESS,
      payload: user,
    });
    
    return user;
  } catch (error) {
    dispatch({
      type: types.FETCH_USER_PROFILE_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Update User Profile
export const updateUserProfile = (userData) => async (dispatch) => {
  dispatch({ type: types.UPDATE_USER_PROFILE_REQUEST });
  
  try {
    const user = await api('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    
    dispatch({
      type: types.UPDATE_USER_PROFILE_SUCCESS,
      payload: user,
    });
    
    return user;
  } catch (error) {
    dispatch({
      type: types.UPDATE_USER_PROFILE_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Delete User (Admin)
export const deleteUser = (id) => async (dispatch) => {
  dispatch({ type: types.DELETE_USER_REQUEST });
  
  try {
    await api(`/api/users/${id}`, {
      method: 'DELETE',
    });
    
    dispatch({
      type: types.DELETE_USER_SUCCESS,
      payload: id,
    });
    
    return id;
  } catch (error) {
    dispatch({
      type: types.DELETE_USER_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Clear User Error
export const clearUserError = () => (dispatch) => {
  dispatch({ type: types.CLEAR_USER_ERROR });
};
