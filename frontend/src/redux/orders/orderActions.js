import { api } from '../../api/api';
import * as types from './orderActionTypes';

// Fetch All Orders (User's Orders)
export const fetchOrders = (auth) => async (dispatch) => {
  dispatch({ type: types.FETCH_ORDERS_REQUEST });

  try {
    const jwt = typeof auth === 'string' ? auth : (auth && auth.jwt) ? auth.jwt : null;
    const userId = auth && typeof auth === 'object' ? auth.userId : null;
    const options = jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : undefined;
    
    const endpoint = userId ? `/api/orders/user/${userId}` : '/api/orders';
    const orders = await api(endpoint, options);

    dispatch({
      type: types.FETCH_ORDERS_SUCCESS,
      payload: orders,
    });
    console.log('Orders successfully fetched in action ---->', orders);
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
  console.group('📦 Create Order Action');
  console.log('Order Data:', orderData);
  console.groupEnd();
  
  dispatch({ type: types.CREATE_ORDER_REQUEST });
  
  try {
    const order = await api('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    
    console.group('✅ Order Created Successfully');
    console.log('Order:', order);
    console.groupEnd();
    
    dispatch({
      type: types.CREATE_ORDER_SUCCESS,
      payload: order,
    });
    
    return order;
  } catch (error) {
    console.group('❌ Create Order Failed');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Error Object:', error);
    console.groupEnd();
    
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
    const order = await api(`/api/orders/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH',
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
    const order = await api(`/api/orders/${id}`, {
      method: 'DELETE',
    });
    
    dispatch({
      type: types.CANCEL_ORDER_SUCCESS,
      payload: order || { id, status: 'CANCELLED' },
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
