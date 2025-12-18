import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../api/api'

export default function ProductDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Requirement: State to track selected quantity
  const [selectedQty, setSelectedQty] = useState(1)

  const MOCK_PRODUCT = {
    id: id || 1,
    name: "Lunar Gray Headphones",
    brand: "Sony",
    category: "Electronics",
    price: 199.99,
    quantity: 5, 
    description: "Experience the ultimate in quality and design. These premium headphones feature 40mm drivers, active noise cancellation, and 30-hour battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"
  };

  useEffect(() => {
    setTimeout(() => {
      setProduct(MOCK_PRODUCT)
      setLoading(false)
    }, 500)
  }, [id])

  // Requirement: Handle Add to Cart with API call and LocalStorage update
  const handleAddToCart = async () => {
    const cartItem = {
      id: Date.now(), // unique instance id for cart
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: selectedQty,
      image: product.image
    };

    try {
      // 1. API Call to /api/basket
      // await api('/api/basket', {
      //   method: 'POST',
      //   body: JSON.stringify({ 
      //     productId: product.id, 
      //     quantity: selectedQty 
      //   })
      // });

      // 2. Append to LocalStorage 'shopping_cart'
      const existingCart = JSON.parse(localStorage.getItem('shopping_cart') || '[]');
      
      // Check if product already exists to merge quantities
      const existingItemIndex = existingCart.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += selectedQty;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('shopping_cart', JSON.stringify(existingCart));
      
      alert(`Added ${selectedQty} ${product.name}(s) to your cart!`);
    } catch (err) {
      console.error("Failed to add to basket", err);
      alert("Error adding item to cart. Please try again.");
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-slate-100 rounded-3xl mx-auto max-w-5xl" />
  if (!product) return <div className="text-center py-20 text-slate-500">Product not found.</div>

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-5xl mx-auto">
      <div className="md:flex">
        <div className="md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-auto max-w-sm shadow-2xl rounded-lg rotate-[-2deg] hover:rotate-0 transition-transform duration-500"
          />
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <button onClick={() => nav(-1)} className="text-sm font-medium text-slate-400 hover:text-indigo-600 mb-6 self-start flex items-center gap-1 transition-colors">
            ← Back to Catalog
          </button>

          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">{product.name}</h1>
          <div className="text-3xl font-bold text-indigo-600 mb-6">${product.price}</div>

          <div className="flex items-center gap-2 mb-8 p-3 bg-slate-50 rounded-xl w-fit border border-slate-100">
            <div className={`h-2.5 w-2.5 rounded-full ${product.quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-semibold text-slate-600">
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Requirement: Quantity Selector */}
          {product.quantity > 0 && (
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Select Quantity</label>
              <div className="flex items-center border border-slate-200 rounded-xl w-fit overflow-hidden bg-white shadow-sm">
                <button 
                  disabled={selectedQty <= 1}
                  onClick={() => setSelectedQty(prev => prev - 1)}
                  className="px-4 py-2 hover:bg-slate-50 disabled:opacity-30 transition-colors border-r border-slate-100"
                >−</button>
                <span className="px-6 py-2 font-bold text-slate-700">{selectedQty}</span>
                <button 
                  disabled={selectedQty >= product.quantity}
                  onClick={() => setSelectedQty(prev => prev + 1)}
                  className="px-4 py-2 hover:bg-slate-50 disabled:opacity-30 transition-colors border-l border-slate-100"
                >+</button>
              </div>
            </div>
          )}

          <div className="mt-auto space-y-4">
            <button
              disabled={product.quantity === 0}
              onClick={handleAddToCart}
              className={`w-full px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg 
                ${product.quantity > 0 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-200' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
            >
              {product.quantity > 0 ? `Add ${selectedQty} to Shopping Cart` : 'Item Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}