import * as types from './userActionTypes';

const initialState = {
  users: [],
  currentUserProfile: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_USERS_REQUEST:
    case types.FETCH_USER_PROFILE_REQUEST:
    case types.UPDATE_USER_PROFILE_REQUEST:
    case types.DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null,
      };

    case types.FETCH_USER_PROFILE_SUCCESS:
    case types.UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        currentUserProfile: action.payload,
        loading: false,
        error: null,
      };

    case types.DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        loading: false,
        error: null,
      };

    case types.FETCH_USERS_FAILURE:
    case types.FETCH_USER_PROFILE_FAILURE:
    case types.UPDATE_USER_PROFILE_FAILURE:
    case types.DELETE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.CLEAR_USER_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default userReducer;
