import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBasket,
  removeFromBasket,
  updateBasketItem,
  clearBasket,
} from '../redux/basket/basketActions';
import { createOrder } from '../redux/orders/orderActions';

/**
 * Example Component: Shopping Basket with Redux
 * 
 * This component demonstrates:
 * - Multiple action dispatches
 * - State updates (increment/decrement quantity)
 * - Delete operations
 * - Computed values (total price)
 * - Checkout process
 */
const BasketExample = () => {
  const dispatch = useDispatch();
  
  const { items, loading, error } = useSelector((state) => state.basket);
  const orderLoading = useSelector((state) => state.orders.loading);
  
  // Fetch basket on mount
  useEffect(() => {
    dispatch(fetchBasket());
  }, [dispatch]);
  
  // Calculate total price
  const totalPrice = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);
  
  // Handle quantity update
  const handleUpdateQuantity = async (basketItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await dispatch(updateBasketItem(basketItemId, newQuantity));
    } catch (error) {
      alert('Failed to update quantity');
    }
  };
  
  // Handle remove item
  const handleRemoveItem = async (basketItemId) => {
    try {
      await dispatch(removeFromBasket(basketItemId));
    } catch (error) {
      alert('Failed to remove item');
    }
  };
  
  // Handle clear basket
  const handleClearBasket = async () => {
    if (window.confirm('Are you sure you want to clear your basket?')) {
      try {
        await dispatch(clearBasket());
      } catch (error) {
        alert('Failed to clear basket');
      }
    }
  };
  
  // Handle checkout
  const handleCheckout = async () => {
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        total: totalPrice,
      };
      
      await dispatch(createOrder(orderData));
      alert('Order placed successfully!');
      // Clear basket after successful order
      await dispatch(clearBasket());
    } catch (error) {
      alert('Failed to place order');
    }
  };
  
  if (loading) {
    return <div>Loading basket...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (items.length === 0) {
    return <div>Your basket is empty</div>;
  }
  
  return (
    <div className="basket">
      <h1>Shopping Basket</h1>
      
      <div className="basket-items">
        {items.map((item) => (
          <div key={item.id} className="basket-item">
            <img src={item.product.image} alt={item.product.name} />
            <div className="item-details">
              <h3>{item.product.name}</h3>
              <p>${item.product.price}</p>
            </div>
            <div className="quantity-controls">
              <button
                onClick={() =>
                  handleUpdateQuantity(item.id, item.quantity - 1)
                }
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  handleUpdateQuantity(item.id, item.quantity + 1)
                }
              >
                +
              </button>
            </div>
            <p className="item-total">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>
      
      <div className="basket-summary">
        <h2>Total: ${totalPrice.toFixed(2)}</h2>
        <button onClick={handleClearBasket} disabled={loading}>
          Clear Basket
        </button>
        <button
          onClick={handleCheckout}
          disabled={orderLoading || items.length === 0}
        >
          {orderLoading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
};

export default BasketExample;
