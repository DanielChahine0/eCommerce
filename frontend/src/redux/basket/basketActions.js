import { api } from '../../api/api';
import * as types from './basketActionTypes';

// Fetch Basket
export const fetchBasket = () => async (dispatch) => {
  dispatch({ type: types.FETCH_BASKET_REQUEST });
  
  try {
    const basket = await api('/api/basket');
    
    dispatch({
      type: types.FETCH_BASKET_SUCCESS,
      payload: basket,
    });
    
    return basket;
  } catch (error) {
    dispatch({
      type: types.FETCH_BASKET_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Add Item to Basket
export const addToBasket = (productId, quantity = 1) => async (dispatch) => {
  dispatch({ type: types.ADD_TO_BASKET_REQUEST });
  
  try {
    const basketItem = await api('/api/basket', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    
    dispatch({
      type: types.ADD_TO_BASKET_SUCCESS,
      payload: basketItem,
    });
    
    return basketItem;
  } catch (error) {
    dispatch({
      type: types.ADD_TO_BASKET_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Update Basket Item Quantity
export const updateBasketItem = (basketItemId, quantity) => async (dispatch) => {
  dispatch({ type: types.UPDATE_BASKET_ITEM_REQUEST });
  
  try {
    const basketItem = await api(`/api/basket/${basketItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
    
    dispatch({
      type: types.UPDATE_BASKET_ITEM_SUCCESS,
      payload: basketItem,
    });
    
    return basketItem;
  } catch (error) {
    dispatch({
      type: types.UPDATE_BASKET_ITEM_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Remove Item from Basket
export const removeFromBasket = (basketItemId) => async (dispatch) => {
  dispatch({ type: types.REMOVE_FROM_BASKET_REQUEST });
  
  try {
    await api(`/api/basket/${basketItemId}`, {
      method: 'DELETE',
    });
    
    dispatch({
      type: types.REMOVE_FROM_BASKET_SUCCESS,
      payload: basketItemId,
    });
    
    return basketItemId;
  } catch (error) {
    dispatch({
      type: types.REMOVE_FROM_BASKET_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Clear Entire Basket
export const clearBasket = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_BASKET_REQUEST });
  
  try {
    await api('/api/basket/clear', {
      method: 'DELETE',
    });
    
    dispatch({
      type: types.CLEAR_BASKET_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: types.CLEAR_BASKET_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Clear Basket Error
export const clearBasketError = () => (dispatch) => {
  dispatch({ type: types.CLEAR_BASKET_ERROR });
};
