import { api } from '../../api/api';
import * as types from './productActionTypes';

export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: types.FETCH_PRODUCTS_REQUEST });
  
  try {
    const products = await api('/api/products');
    
    dispatch({
      type: types.FETCH_PRODUCTS_SUCCESS,
      payload: products,
    });
    console.log('Products fetched:', products);
    return products;
  } catch (error) {
    dispatch({
      type: types.FETCH_PRODUCTS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Fetch Product Details by ID
export const fetchProductDetails = (id) => async (dispatch) => {
  dispatch({ type: types.FETCH_PRODUCT_DETAILS_REQUEST });
  
  try {
    const product = await api(`/api/products/${id}`);
    
    dispatch({
      type: types.FETCH_PRODUCT_DETAILS_SUCCESS,
      payload: product,
    });
    
    return product;
  } catch (error) {
    dispatch({
      type: types.FETCH_PRODUCT_DETAILS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Search Products
export const searchProducts = (query) => async (dispatch) => {
  dispatch({ type: types.SEARCH_PRODUCTS_REQUEST });
  
  try {
    const products = await api(`/api/products/search?q=${encodeURIComponent(query)}`);
    
    dispatch({
      type: types.SEARCH_PRODUCTS_SUCCESS,
      payload: products,
    });
    
    return products;
  } catch (error) {
    dispatch({
      type: types.SEARCH_PRODUCTS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Create Product (Admin)
export const createProduct = (productData) => async (dispatch) => {
  dispatch({ type: types.CREATE_PRODUCT_REQUEST });
  
  try {
    const product = await api('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    
    dispatch({
      type: types.CREATE_PRODUCT_SUCCESS,
      payload: product,
    });
    
    return product;
  } catch (error) {
    dispatch({
      type: types.CREATE_PRODUCT_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Update Product (Admin)
export const updateProduct = (id, productData) => async (dispatch) => {
  dispatch({ type: types.UPDATE_PRODUCT_REQUEST });
  
  try {
    const product = await api(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    
    dispatch({
      type: types.UPDATE_PRODUCT_SUCCESS,
      payload: product,
    });
    
    return product;
  } catch (error) {
    dispatch({
      type: types.UPDATE_PRODUCT_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Delete Product (Admin)
export const deleteProduct = (id) => async (dispatch) => {
  dispatch({ type: types.DELETE_PRODUCT_REQUEST });
  
  try {
    await api(`/api/products/${id}`, {
      method: 'DELETE',
    });
    
    dispatch({
      type: types.DELETE_PRODUCT_SUCCESS,
      payload: id,
    });
    
    return id;
  } catch (error) {
    dispatch({
      type: types.DELETE_PRODUCT_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Clear Product Error
export const clearProductError = () => (dispatch) => {
  dispatch({ type: types.CLEAR_PRODUCT_ERROR });
};