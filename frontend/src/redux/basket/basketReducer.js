import * as types from './basketActionTypes';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const basketReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_BASKET_REQUEST:
    case types.ADD_TO_BASKET_REQUEST:
    case types.UPDATE_BASKET_ITEM_REQUEST:
    case types.REMOVE_FROM_BASKET_REQUEST:
    case types.CLEAR_BASKET_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_BASKET_SUCCESS:
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null,
      };

    case types.ADD_TO_BASKET_SUCCESS:
      // Check if item already exists in basket
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = action.payload;
        return {
          ...state,
          items: updatedItems,
          loading: false,
          error: null,
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, action.payload],
          loading: false,
          error: null,
        };
      }

    case types.UPDATE_BASKET_ITEM_SUCCESS:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        loading: false,
        error: null,
      };

    case types.REMOVE_FROM_BASKET_SUCCESS:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        loading: false,
        error: null,
      };

    case types.CLEAR_BASKET_SUCCESS:
      return {
        ...state,
        items: [],
        loading: false,
        error: null,
      };

    case types.FETCH_BASKET_FAILURE:
    case types.ADD_TO_BASKET_FAILURE:
    case types.UPDATE_BASKET_ITEM_FAILURE:
    case types.REMOVE_FROM_BASKET_FAILURE:
    case types.CLEAR_BASKET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.CLEAR_BASKET_ERROR:
      return {
        ...state,
        error: null,
      };

    // Local basket actions
    case types.LOAD_LOCAL_BASKET:
    case types.ADD_TO_LOCAL_BASKET:
    case types.UPDATE_LOCAL_BASKET_ITEM:
    case types.REMOVE_FROM_LOCAL_BASKET:
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null,
      };

    case types.CLEAR_LOCAL_BASKET:
      return {
        ...state,
        items: [],
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default basketReducer;
