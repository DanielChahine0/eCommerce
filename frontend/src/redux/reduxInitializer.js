import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../redux/auth/authActions';
import { setAuthToken as setApiToken } from '../api/api';

/**
 * Hook to initialize Redux state from localStorage
 * Call this in your main App component
 */
export const useReduxInitializer = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Restore auth token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Set token in API utility
      setApiToken(token);
      
      // Set token in Redux state
      dispatch(setAuthToken(token));
      
      // Optionally fetch user profile here
      // dispatch(fetchUserProfile());
    }
  }, [dispatch]);
};

export default useReduxInitializer;
