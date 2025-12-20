import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../redux/products/productActions";
import { addToBasket, addToLocalBasket } from "../redux/basket/basketActions";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const {products} = useSelector((state) => state.products);

  const product = products.find((p) => p.id === Number(id));

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

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      if (user) {
        // Add to server basket for authenticated users
        await dispatch(addToBasket(user.id, product.id, quantity));
      } else {
        // Add to local basket for guest users
        dispatch(addToLocalBasket(product, quantity));
      }
      alert("Added to cart successfully!");
    } catch (err) {
      setError("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-300 p-8 flex items-center justify-center">
        <div className="text-xl">Loading product details...</div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-300 p-8 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-300 p-8 flex items-center justify-center">
        <div className="text-xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-300 p-8">
      <div className="mx-auto w-full max-w-6xl bg-white shadow-md">
        {/* top bar */}
        <div className="h-10 bg-gray-400" />

        {error && (
          <div className="mx-10 mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="px-10 py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_1fr] lg:gap-16">
            {/* LEFT */}
            <div>
              <div className="h-64 w-full rounded-md bg-gray-200 overflow-hidden">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="mt-16 space-y-2 text-xl leading-tight">
                <div>Price: <span className="font-bold">${product.price}</span></div>
                <div>Quantity Available: <span className="font-bold">{product.quantity}</span></div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <h1 className="text-center text-4xl font-medium tracking-tight">
                {product.name}
              </h1>

              <div className="mx-auto mt-10 max-w-xl text-sm">
                <div className="space-y-1">
                  <div>
                    <span className="mr-2">Category:</span>
                    <span className="capitalize">{product.categoryName || "N/A"}</span>
                  </div>
                  <div>
                    <span className="mr-2">Brand:</span>
                    <span>{product.brandName || "N/A"}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-1">
                  <div>
                    <span className="mr-1">Price:</span>
                    <span>${product.price}</span>
                  </div>
                  <div>
                    <span className="mr-2">Quantity Available:</span>
                    <span>{product.quantity}</span>
                  </div>
                </div>

                <div className="mt-10 text-sm font-medium">Description</div>

                <div className="mt-3 rounded-md bg-gray-200 p-6">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-900">
                    {product.description || "No description available"}
                  </pre>
                </div>

                <div className="mt-10 flex items-center justify-end gap-4">
                  {/* quantity dropdown */}
                  <div className="relative">
                    <select 
                      className="h-10 w-28 appearance-none rounded-md border border-gray-500 bg-gray-200 px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-gray-400"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      disabled={product.quantity === 0}
                    >
                      {Array.from({ length: Math.min(product.quantity, 10) }, (_, index) => {
                        const value = index + 1;
                        return (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        );
                      })}
                    </select>

                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-800"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <button 
                    className="h-10 rounded-md bg-gray-200 px-5 text-sm font-medium text-gray-900 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0 || addingToCart}
                  >
                    {addingToCart ? "Adding..." : product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
            {/* /RIGHT */}
          </div>
        </div>
      </div>
    </div>
  );
}
