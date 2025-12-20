import * as types from './orderActionTypes';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ORDERS_REQUEST:
    case types.FETCH_ORDER_DETAILS_REQUEST:
    case types.CREATE_ORDER_REQUEST:
    case types.UPDATE_ORDER_STATUS_REQUEST:
    case types.CANCEL_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload,
        loading: false,
        error: null,
      };

    case types.FETCH_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        currentOrder: action.payload,
        loading: false,
        error: null,
      };

    case types.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: [...state.orders, action.payload],
        currentOrder: action.payload,
        loading: false,
        error: null,
      };

    case types.UPDATE_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
        currentOrder:
          state.currentOrder?.id === action.payload.id
            ? action.payload
            : state.currentOrder,
        loading: false,
        error: null,
      };

    case types.CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? { ...order, ...action.payload } : order
        ),
        currentOrder:
          state.currentOrder?.id === action.payload.id
            ? { ...state.currentOrder, ...action.payload }
            : state.currentOrder,
        loading: false,
        error: null,
      };

    case types.FETCH_ORDERS_FAILURE:
    case types.FETCH_ORDER_DETAILS_FAILURE:
    case types.CREATE_ORDER_FAILURE:
    case types.UPDATE_ORDER_STATUS_FAILURE:
    case types.CANCEL_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.CLEAR_ORDER_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default orderReducer;
