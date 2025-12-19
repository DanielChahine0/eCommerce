import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchBasket, 
  updateBasketItem, 
  removeFromBasket,
  loadLocalBasket,
  updateLocalBasketItem,
  removeFromLocalBasket 
} from '../redux/basket/basketActions'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Cart() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const basketItems = useSelector((state) => state.basket.items);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBasket = async () => {
      try {
        setLoading(true);
        if (user) {
          // Load server basket for authenticated users
          await dispatch(fetchBasket(user.id));
        } else {
          // Load local basket for guest users
          dispatch(loadLocalBasket());
        }
      } catch (err) {
        setError("Failed to load cart");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBasket();
  }, [user, dispatch]);

  const updateQuantity = async (basketItemId, currentQuantity, delta) => {
    const newQty = Math.max(1, currentQuantity + delta);
    try {
      if (user) {
        // Update server basket
        await dispatch(updateBasketItem(basketItemId, newQty));
      } else {
        // Update local basket
        dispatch(updateLocalBasketItem(basketItemId, newQty));
      }
    } catch (err) {
      setError("Failed to update quantity");
    }
  };

  const removeItem = async (basketItemId) => {
    try {
      if (user) {
        // Remove from server basket
        await dispatch(removeFromBasket(basketItemId));
      } else {
        // Remove from local basket
        dispatch(removeFromLocalBasket(basketItemId));
      }
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const total = basketItems.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);

  if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />

  if (error) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
      </div>
    );
  }

  if (basketItems.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Shopping Cart</h1>
        <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-2">
          ← Continue Shopping
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <ul className="divide-y divide-slate-100 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {basketItems.map(i => (
              <li key={i.id} className="p-6 flex items-center">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                  <img 
                    src={i.product?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"} 
                    alt={i.product?.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                
                <div className="ml-6 flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium text-slate-900">{i.product?.name}</h3>
                    <button 
                      onClick={() => removeItem(i.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(i.id, i.quantity, -1)}
                        className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border-r border-slate-200"
                      >-</button>
                      <span className="px-4 py-1 text-slate-900 font-medium">{i.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(i.id, i.quantity, 1)}
                        className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border-l border-slate-200"
                      >+</button>
                    </div>
                    <p className="text-lg font-bold text-slate-900">${((i.product?.price || 0) * i.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h2 className="text-lg font-medium text-slate-900 mb-6">Order Summary</h2>
            <div className="py-4 flex items-center justify-between border-t border-slate-100">
              <dt className="text-base font-bold text-slate-900">Order Total</dt>
              <dd className="text-xl font-bold text-indigo-600">${total.toLocaleString()}</dd>
            </div>
            {user ? (
              <Link to="/checkout" className="mt-6 w-full flex justify-center items-center px-6 py-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all shadow-lg shadow-indigo-100">
                Proceed to Checkout
              </Link>
            ) : (
              <Link to="/login" className="mt-6 w-full flex justify-center items-center px-6 py-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-all shadow-lg shadow-indigo-100">
                Login to Checkout
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}