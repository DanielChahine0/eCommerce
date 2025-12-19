import * as types from './productActionTypes';

const initialState = {
  products: [],
  currentProduct: null,
  searchResults: [],
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_PRODUCTS_REQUEST:
    case types.FETCH_PRODUCT_DETAILS_REQUEST:
    case types.SEARCH_PRODUCTS_REQUEST:
    case types.CREATE_PRODUCT_REQUEST:
    case types.UPDATE_PRODUCT_REQUEST:
    case types.DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };

    case types.FETCH_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        currentProduct: action.payload,
        loading: false,
        error: null,
      };

    case types.SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        loading: false,
        error: null,
      };

    case types.CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: [...state.products, action.payload],
        loading: false,
        error: null,
      };

    case types.UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
        currentProduct:
          state.currentProduct?.id === action.payload.id
            ? action.payload
            : state.currentProduct,
        loading: false,
        error: null,
      };

    case types.DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
        loading: false,
        error: null,
      };

    case types.FETCH_PRODUCTS_FAILURE:
    case types.FETCH_PRODUCT_DETAILS_FAILURE:
    case types.SEARCH_PRODUCTS_FAILURE:
    case types.CREATE_PRODUCT_FAILURE:
    case types.UPDATE_PRODUCT_FAILURE:
    case types.DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.CLEAR_PRODUCT_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default productReducer;
