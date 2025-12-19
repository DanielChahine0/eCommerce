import { combineReducers } from 'redux';
import authReducer from './auth/authReducer';
import productReducer from './products/productReducer';
import basketReducer from './basket/basketReducer';
import orderReducer from './orders/orderReducer';
import userReducer from './users/userReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  basket: basketReducer,
  orders: orderReducer,
  users: userReducer,
});

export default rootReducer;
