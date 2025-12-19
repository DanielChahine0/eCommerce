import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../redux/auth/authActions';
import { useNavigate } from 'react-router-dom';

/**
 * Example Component: Login Form with Redux
 * 
 * This component demonstrates:
 * - Form handling with Redux
 * - Authentication flow
 * - Error handling and clearing
 * - Navigation after successful login
 */
const LoginExample = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(login(formData));
      // Navigate to home on success
      navigate('/');
    } catch (error) {
      // Error is already handled by reducer
      console.error('Login failed:', error);
    }
  };
  
  // Clear error when component unmounts
  React.useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="login-form">
      <h2>Login</h2>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => dispatch(clearAuthError())}>×</button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginExample;
