import React, { useId, useMemo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../redux/products/productActions";
import { 
  ChevronDown, 
  ShoppingCart, 
  Star, 
  Heart,
  LayoutGrid,
  ListFilter,
  Search,
  Loader2
} from "lucide-react";

export default function SearchProduct() {
  const uid = useId();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 1. Initialize search params
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  // Redux state
  const { searchResults, loading, error } = useSelector((state) => state.products);

  // Local state for search input to allow typing before submitting
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery);

  // Effect to sync local state with URL param (e.g. on back button)
  useEffect(() => {
    setLocalSearchTerm(searchQuery);
  }, [searchQuery]);

  // Effect to dispatch search action when URL param changes
  useEffect(() => {
    if (searchQuery) {
      dispatch(searchProducts(searchQuery));
    }
  }, [dispatch, searchQuery]);

  // 2. Read values from URL (or use defaults)
  const min = 0;
  const max = 500;
  
  const priceRange = Number(searchParams.get("price")) || 250;
  const includeOOS = searchParams.get("oos") === "true";
  const selectedCategory = searchParams.get("category") || "All";
  const sortBy = searchParams.get("sort") || "Recommended";
  
  // Parse comma-separated brands string into a Set
  const selectedBrands = useMemo(() => {
    const brandsParam = searchParams.get("brands");
    if (!brandsParam) return new Set();
    return new Set(brandsParam.split(","));
  }, [searchParams]);


  // 3. Helper to update URL params
  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === "" || value === "All") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams("search", localSearchTerm);
  };

  // Specific Handlers
  const toggleBrand = (brand) => {
    const newBrands = new Set(selectedBrands);
    if (newBrands.has(brand)) newBrands.delete(brand);
    else newBrands.add(brand);

    // Convert Set back to comma-separated string
    const brandsString = Array.from(newBrands).join(",");
    updateParams("brands", brandsString || null);
  };

  const resetFilters = () => {
    setSearchParams({}); // Clears all params
    setLocalSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- Top Navigation Bar --- */}
      <div className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
            <LayoutGrid className="h-6 w-6" /> STORE.
          </div>
          <form onSubmit={handleSearchSubmit} className="relative hidden w-96 sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-black/5"
            />
          </form>
          <div className="flex gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full"><Heart className="h-5 w-5 text-gray-600" /></button>
            <button onClick={() => navigate('/cart')} className="p-2 hover:bg-gray-100 rounded-full"><ShoppingCart className="h-5 w-5 text-gray-600" /></button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          
          {/* --- Sidebar Filters --- */}
          <aside className="w-full lg:w-64 lg:shrink-0">
            <div className="sticky top-24 space-y-8">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button 
                  onClick={resetFilters}
                  className="text-xs font-medium text-gray-500 hover:text-black hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Categories (Pills) */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Categories</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateParams("category", c)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedCategory === c
                          ? "bg-black text-white"
                          : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Max Price</span>
                  <span className="text-sm font-medium text-gray-900">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={priceRange}
                  onChange={(e) => updateParams("price", e.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-black"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>${min}</span>
                  <span>${max}</span>
                </div>
              </div>

              {/* Brands (Checkbox List) */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Brands</span>
                <div className="space-y-2">
                  {brands.map((b) => {
                    const checkboxId = `${uid}-${b.replace(/\s+/g, "-")}`;
                    return (
                      <label key={b} htmlFor={checkboxId} className="flex cursor-pointer items-center gap-3 group">
                        <div className="relative flex items-center">
                          <input
                            id={checkboxId}
                            type="checkbox"
                            checked={selectedBrands.has(b)}
                            onChange={() => toggleBrand(b)}
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-black checked:bg-black transition-all"
                          />
                          <svg
                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                            width="10"
                            height="10"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{b}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Availability Toggle */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50">
                <span className="text-sm font-medium text-gray-700">Include Out of Stock</span>
                <div className={`relative h-5 w-9 rounded-full transition-colors ${includeOOS ? 'bg-black' : 'bg-gray-300'}`}>
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={includeOOS} 
                    onChange={(e) => updateParams("oos", e.target.checked ? "true" : null)} 
                  />
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${includeOOS ? 'left-[18px]' : 'left-0.5'}`} />
                </div>
              </label>

            </div>
          </aside>

          {/* --- Main Content --- */}
          <main className="flex-1">
            
            {/* Results Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
                </h1>
                <p className="mt-1 text-sm text-gray-500">Showing {searchResults.length} results</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => updateParams("sort", e.target.value)}
                    className="h-10 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none hover:border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                  >
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest Arrivals</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900">
                  <ListFilter className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content State Handling */}
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
                <p>Error loading products: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-sm font-semibold underline"
                >
                  Try Again
                </button>
              </div>
            ) : searchResults.length === 0 ? (
               <div className="flex h-64 flex-col items-center justify-center text-gray-500">
                 <Search className="h-12 w-12 opacity-20 mb-4" />
                 <p className="text-lg font-medium">No products found</p>
                 <p className="text-sm">Try adjusting your search or filters</p>
               </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((product) => (
                  <div 
                    key={product.id} 
                    className="group relative cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Image Container */}
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-200 relative">
                      <img
                        src={product.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Hover Button */}
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-black shadow-lg hover:bg-gray-50">
                          <ShoppingCart className="h-4 w-4" /> Add to Cart
                        </button>
                      </div>

                      {/* Favorite Button (Top Right) */}
                      <button className="absolute right-3 top-3 rounded-full bg-white/80 p-1.5 text-gray-900 backdrop-blur-sm transition hover:bg-white hover:text-red-500">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">${product.price}</p>
                    </div>

                    {/* Rating */}
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-gray-500">4.5</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination / Load More */}
            {!loading && searchResults.length > 0 && (
              <div className="mt-12 flex justify-center border-t border-gray-200 pt-8">
                <button className="rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 hover:shadow-sm">
                  Load More Products
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}