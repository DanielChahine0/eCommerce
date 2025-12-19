import { api } from '../../api/api';
import * as types from './orderActionTypes';

// Fetch All Orders (User's Orders)
export const fetchOrders = () => async (dispatch) => {
  dispatch({ type: types.FETCH_ORDERS_REQUEST });
  
  try {
    const orders = await api('/api/orders');
    
    dispatch({
      type: types.FETCH_ORDERS_SUCCESS,
      payload: orders,
    });
    
    return orders;
  } catch (error) {
    dispatch({
      type: types.FETCH_ORDERS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Fetch Order Details by ID
export const fetchOrderDetails = (id) => async (dispatch) => {
  dispatch({ type: types.FETCH_ORDER_DETAILS_REQUEST });
  
  try {
    const order = await api(`/api/orders/${id}`);
    
    dispatch({
      type: types.FETCH_ORDER_DETAILS_SUCCESS,
      payload: order,
    });
    
    return order;
  } catch (error) {
    dispatch({
      type: types.FETCH_ORDER_DETAILS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Create Order (Checkout)
export const createOrder = (orderData) => async (dispatch) => {
  dispatch({ type: types.CREATE_ORDER_REQUEST });
  
  try {
    const order = await api('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    
    dispatch({
      type: types.CREATE_ORDER_SUCCESS,
      payload: order,
    });
    
    return order;
  } catch (error) {
    dispatch({
      type: types.CREATE_ORDER_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = (id, status) => async (dispatch) => {
  dispatch({ type: types.UPDATE_ORDER_STATUS_REQUEST });
  
  try {
    const order = await api(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    
    dispatch({
      type: types.UPDATE_ORDER_STATUS_SUCCESS,
      payload: order,
    });
    
    return order;
  } catch (error) {
    dispatch({
      type: types.UPDATE_ORDER_STATUS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Cancel Order
export const cancelOrder = (id) => async (dispatch) => {
  dispatch({ type: types.CANCEL_ORDER_REQUEST });
  
  try {
    const order = await api(`/api/orders/${id}/cancel`, {
      method: 'PUT',
    });
    
    dispatch({
      type: types.CANCEL_ORDER_SUCCESS,
      payload: order,
    });
    
    return order;
  } catch (error) {
    dispatch({
      type: types.CANCEL_ORDER_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Clear Order Error
export const clearOrderError = () => (dispatch) => {
  dispatch({ type: types.CLEAR_ORDER_ERROR });
};
