import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/orders/orderActions';

/**
 * Example Component: Order History with Redux
 * 
 * This component demonstrates:
 * - Fetching and displaying list data
 * - Formatted dates
 * - Status display
 */
const OrderHistoryExample = () => {
  const dispatch = useDispatch();
  
  const { orders, loading, error } = useSelector((state) => state.orders);
  
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  
  if (loading) {
    return <div>Loading orders...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (orders.length === 0) {
    return <div>No orders found</div>;
  }
  
  return (
    <div className="order-history">
      <h1>Order History</h1>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <p>Date: {new Date(order.timeCreated).toLocaleDateString()}</p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <p>
              Shipping Address: {order.address.street}, {order.address.city}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryExample;
