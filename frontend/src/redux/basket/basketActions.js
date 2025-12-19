import { api } from '../../api/api';
import * as types from './basketActionTypes';

// Fetch Basket
export const fetchBasket = (userId) => async (dispatch) => {
  dispatch({ type: types.FETCH_BASKET_REQUEST });
  
  try {
    const basket = await api(`/api/basket/user/${userId}`);
    
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
export const addToBasket = (userId, productId, quantity = 1) => async (dispatch) => {
  dispatch({ type: types.ADD_TO_BASKET_REQUEST });
  
  try {
    const basketItem = await api('/api/basket', {
      method: 'POST',
      body: JSON.stringify({ userId, productId, quantity }),
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
    const basketItem = await api(`/api/basket/${basketItemId}?quantity=${quantity}`, {
      method: 'PATCH',
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
export const clearBasket = (userId) => async (dispatch) => {
  dispatch({ type: types.CLEAR_BASKET_REQUEST });
  
  try {
    await api(`/api/basket/user/${userId}`, {
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

// Local storage key for guest basket
const LOCAL_BASKET_KEY = 'guestBasket';

// Helper to get local basket from localStorage
const getLocalBasket = () => {
  try {
    const basket = localStorage.getItem(LOCAL_BASKET_KEY);
    return basket ? JSON.parse(basket) : [];
  } catch (error) {
    console.error('Error reading local basket:', error);
    return [];
  }
};

// Helper to save local basket to localStorage
const saveLocalBasket = (items) => {
  try {
    localStorage.setItem(LOCAL_BASKET_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving local basket:', error);
  }
};

// Load local basket from localStorage
export const loadLocalBasket = () => (dispatch) => {
  const localItems = getLocalBasket();
  dispatch({
    type: types.LOAD_LOCAL_BASKET,
    payload: localItems,
  });
};

// Add to local basket (for non-authenticated users)
export const addToLocalBasket = (product, quantity = 1) => (dispatch, getState) => {
  const localItems = [...getLocalBasket()];
  
  // Check if item already exists
  const existingIndex = localItems.findIndex(item => item.product.id === product.id);
  
  if (existingIndex >= 0) {
    // Update quantity if exists
    localItems[existingIndex].quantity += quantity;
  } else {
    // Add new item with a temporary local ID
    const newItem = {
      id: `local-${Date.now()}-${Math.random()}`,
      product: product,
      quantity: quantity,
    };
    localItems.push(newItem);
  }
  
  saveLocalBasket(localItems);
  
  dispatch({
    type: types.ADD_TO_LOCAL_BASKET,
    payload: localItems,
  });
};

// Update local basket item quantity
export const updateLocalBasketItem = (itemId, quantity) => (dispatch) => {
  const localItems = getLocalBasket();
  const updatedItems = localItems.map(item => 
    item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
  );
  
  saveLocalBasket(updatedItems);
  
  dispatch({
    type: types.UPDATE_LOCAL_BASKET_ITEM,
    payload: updatedItems,
  });
};

// Remove from local basket
export const removeFromLocalBasket = (itemId) => (dispatch) => {
  const localItems = getLocalBasket();
  const updatedItems = localItems.filter(item => item.id !== itemId);
  
  saveLocalBasket(updatedItems);
  
  dispatch({
    type: types.REMOVE_FROM_LOCAL_BASKET,
    payload: updatedItems,
  });
};

// Clear local basket
export const clearLocalBasket = () => (dispatch) => {
  localStorage.removeItem(LOCAL_BASKET_KEY);
  
  dispatch({
    type: types.CLEAR_LOCAL_BASKET,
  });
};

// Merge local basket with server basket (call this after login)
export const mergeLocalBasketWithServer = (userId) => async (dispatch) => {
  const localItems = getLocalBasket();
  
  if (localItems.length === 0) {
    // No local items to merge, just fetch server basket
    return dispatch(fetchBasket(userId));
  }
  
  try {
    // Add all local items to server
    for (const item of localItems) {
      await dispatch(addToBasket(userId, item.product.id, item.quantity));
    }
    
    // Clear local basket after successful merge
    dispatch(clearLocalBasket());
    
    // Fetch updated server basket
    return dispatch(fetchBasket(userId));
  } catch (error) {
    console.error('Error merging local basket with server:', error);
    throw error;
  }
};

