import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/products/productActions';
import { addToBasket } from '../redux/basket/basketActions';

/**
 * Example Component: Product List with Redux
 * 
 * This component demonstrates:
 * - useDispatch: To dispatch actions
 * - useSelector: To access Redux state
 * - Async actions with redux-thunk
 * - Error handling
 * - Loading states
 */
const ProductListExample = () => {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const { products, loading, error } = useSelector((state) => state.products);
  const basketLoading = useSelector((state) => state.basket.loading);
  
  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  // Handle add to basket
  const handleAddToBasket = async (productId) => {
    try {
      await dispatch(addToBasket(productId, 1));
      alert('Product added to basket!');
    } catch (error) {
      alert('Failed to add product to basket');
    }
  };
  
  // Loading state
  if (loading) {
    return <div>Loading products...</div>;
  }
  
  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="product-list">
      <h1>Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <p>Stock: {product.quantity}</p>
            <button
              onClick={() => handleAddToBasket(product.id)}
              disabled={basketLoading || product.quantity === 0}
            >
              {basketLoading ? 'Adding...' : 'Add to Basket'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListExample;
