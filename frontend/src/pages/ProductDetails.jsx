import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../redux/products/productActions";
import { addToBasket, addToLocalBasket } from "../redux/basket/basketActions";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, ArrowLeft, AlertCircle, Package, Minus, Plus, Heart } from "lucide-react";
import { isProductLiked, toggleLikedProduct } from "../utils/likes";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { products, currentProduct } = useSelector((state) => state.products);
  const product = products.find((p) => p.id === Number(id)) || 
                  (currentProduct && currentProduct.id === Number(id) ? currentProduct : null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        await dispatch(fetchProductDetails(id));
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, dispatch]);

  useEffect(() => {
    if (!product) return;
    setIsLiked(isProductLiked(product.id, user));
  }, [product, user]);

  const handleAddToCart = async () => {
    const finalQty = quantity === "" ? 1 : quantity;

    try {
      setAddingToCart(true);
      if (user) {
        await dispatch(addToBasket(user.id, product.id, finalQty));
      } else {
        dispatch(addToLocalBasket(product, finalQty));
      }
      alert("Added to cart successfully!");
    } catch (err) {
      setError("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleLike = () => {
    if (!product) return;
    const updated = toggleLikedProduct(product, user);
    setIsLiked(updated.some((item) => item.id === product.id));
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setQuantity("");
      return;
    }
    const numVal = parseInt(val);
    if (isNaN(numVal)) return;
    const maxStock = product.quantity || product.quantity || 0; 

    if (numVal > maxStock) {
      setQuantity(maxStock);
    } else {
      setQuantity(numVal);
    }
  };

  const handleBlur = () => {
    if (quantity === "" || quantity < 1) {
      setQuantity(1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(Number(quantity) - 1);
  };

  const increaseQty = () => {
    const maxStock = product.quantity || product.quantity || 0;
    if (quantity < maxStock) setQuantity(Number(quantity) + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 lg:p-12">
        <div className="mx-auto max-w-7xl animate-pulse">
           <div className="h-6 w-24 bg-gray-200 rounded mb-8"></div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="aspect-square bg-gray-200 rounded-xl"></div>
             <div className="space-y-4 mt-8 lg:mt-0">
               <div className="h-4 w-32 bg-gray-200 rounded"></div>
               <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
               <div className="h-6 w-20 bg-gray-200 rounded"></div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  if (!loading && !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="text-gray-600 mt-2">{error || "The product you are looking for does not exist."}</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
          Back to Store
        </button>
      </div>
    );
  }

  const currentStock = product.quantity !== undefined ? product.quantity : product.quantity;
  const isOutOfStock = currentStock === 0;

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button onClick={() => navigate(-1)} className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div className="product-image-container">
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-100 relative group">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                   <Package className="w-20 h-20 opacity-20" />
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Sold Out</div>
              )}
            </div>
          </div>

          <div className="mt-10 px-2 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">{product.brandName || "Brand"}</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500 capitalize">{product.categoryName || "General"}</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>

            <div className="mt-4 flex items-end gap-4">
              <p className="text-3xl tracking-tight text-gray-900">${product.price}</p>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <div className="mt-4 prose prose-sm text-gray-600 leading-relaxed">
                <p>{product.description || "No description available."}</p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {isOutOfStock ? "Out of Stock" : `${currentStock} items in stock`}
              </span>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center rounded-lg border border-gray-300 sm:w-32">
                <button 
                  type="button"
                  onClick={decreaseQty}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent rounded-l-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <input 
                  type="number"
                  min="1"
                  max={currentStock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  onBlur={handleBlur}
                  disabled={isOutOfStock}
                  className="w-full text-center border-none p-0 focus:ring-0 text-gray-900 font-medium [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                />

                <button 
                  type="button"
                  onClick={increaseQty}
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="px-3 py-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent rounded-r-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className={`flex-1 flex items-center justify-center gap-3 rounded-lg px-8 py-3 text-base font-medium text-white transition-all shadow-sm ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'}`}
              >
                {addingToCart ? "Adding..." : isOutOfStock ? "Currently Unavailable" : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
              </button>
              <button
                type="button"
                onClick={handleToggleLike}
                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  isLiked
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-gray-300 text-gray-700 hover:border-red-200 hover:text-red-600"
                }`}
                aria-pressed={isLiked}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                {isLiked ? "Liked" : "Like"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
