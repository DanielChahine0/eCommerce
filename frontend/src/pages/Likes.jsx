import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getLikedProducts, toggleLikedProduct } from "../utils/likes";

export default function Likes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likedProducts, setLikedProducts] = useState(() => getLikedProducts(user));

  useEffect(() => {
    setLikedProducts(getLikedProducts(user));
  }, [user]);

  const handleToggleLike = (product) => {
    const updated = toggleLikedProduct(product, user);
    setLikedProducts(updated);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Collection
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Liked Products</h1>
          </div>
        </div>

        {likedProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
            You have not liked any products yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {likedProducts.map((product) => (
              <div
                key={product.id}
                className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="h-32 w-32 shrink-0 overflow-hidden"
                >
                  <img
                    src={
                      product.imageUrl ||
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"
                    }
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
                <div className="flex flex-1 items-center justify-between gap-4 p-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {product.category || "Product"}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {product.name}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-800">
                      ${product.price}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleLike(product)}
                    className="rounded-full border border-slate-200 bg-white p-2 text-red-500 transition hover:bg-red-50"
                    aria-label="Remove from likes"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
