import { useEffect, useState, useMemo, memo, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/products/productActions'
import { Link, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
} from "@/components/ui/card"

const INITIAL_BATCH_SIZE = 20;
const BATCH_SIZE = 20;

// Memoized Product Card Component
const ProductCard = memo(({ product, onNavigate, priority }) => {
  const handleClick = useCallback(() => {
    onNavigate(product.id);
  }, [onNavigate, product.id]);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        {/* <img 
          src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500" 
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
        /> */}
        {product.stockQuantity === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">OUT OF STOCK</div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{product?.brandName || "N/A"}</span>
        <h2 className="font-bold text-lg text-slate-800 mb-1">{product.name}</h2>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">${product.price}</span>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';

// Memoized Category Card Component
const CategoryCard = memo(({ category, onClick }) => (
  <article
    role="button"
    tabIndex={0}
    onClick={onClick}
    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden flex flex-col cursor-pointer"
  >
    <div className="relative h-48 overflow-hidden">
      <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-500" loading="lazy" />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h2 className="font-bold text-lg text-slate-800 mb-1">{category.name}</h2>
      <div className="mt-auto flex items-center justify-between"></div>
    </div>
  </article>
));

CategoryCard.displayName = 'CategoryCard';

export default function Catalog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.products);
  const productsLoading = useSelector((state) => state.products.loading);
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);
  const loadMoreRef = useRef(null);
  
  // State for search, filter, and sort
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortConfig, setSortConfig] = useState('newest')

  // Memoize categories to prevent re-creation
  const categories = useMemo(() => [
    { id: "101", name: "Jewelry", image: "https://unsplash.com/pt-br/fotografias/fragmento-de-pedra-branca-e-preta-5ngCICAXiH0" },
    { id: "102", name: "Books", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
    { id: "103", name: "Tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
    { id: "104", name: "Clothes", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
    { id: "105", name: "Sports", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
  ], []);

  useEffect(() => {
    const loadProducts = async () => {
      // Only fetch if we don't have products already
      if (products && products.length > 0) {
        return;
      }
      
      try {
        await dispatch(fetchProducts());
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };
    loadProducts();
  }, [dispatch, products]);

  // Memoize navigation callbacks
  const handleProductClick = useCallback((id) => {
    navigate(`/product/${id}`);
  }, [navigate]);

  const handleCategoryClick = useCallback((id) => {
    navigate(`/product/${id}`);
  }, [navigate]);

  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [products]);

  useEffect(() => {
    if (!loadMoreRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;

        setVisibleCount((count) => {
          if (count >= products.length) return count;
          return Math.min(count + BATCH_SIZE, products.length);
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [products.length]);

  const visibleProducts = useMemo(() => {
    if (!products?.length) return [];
    return products.slice(0, visibleCount);
  }, [products, visibleCount]);

  const isLoading = productsLoading && products.length === 0;
  const hasMore = visibleProducts.length < products.length;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-8">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="h-48 bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-1/3 rounded bg-slate-200" />
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-5 w-1/2 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (

      <div className='flex flex-col items-center gap-8 mb-20'>
          <div className='max-w-[85rem] mx-auto w-full px-4'>
            <Card className='bg-[#4E4E4E] text-white mb-8'>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <div className='font-bold'>An ecommerce application made by students, for students</div>
                    <div>What are you looking for today?</div>
                </div>
                </CardContent>
            </Card>
          </div>


          <div className="max-w-7xl mx-auto px-4">
          {/* Search and Sort Bar
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <input 
              type="text" 
              placeholder="Search by name, brand, or keyword..." 
              className="w-full md:w-96 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-4 w-full md:w-auto">
              <select 
                className="px-4 py-2 rounded-lg border border-slate-200 outline-none bg-white"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Office">Office</option>
                <option value="Kitchen">Kitchen</option>
              </select>
              <select 
                className="px-4 py-2 rounded-lg border border-slate-200 outline-none bg-white"
                onChange={(e) => setSortConfig(e.target.value)}
              >
                <option value="newest">Sort By: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
            </div>
          </div> */}




          <p className='font-bold'>Trending Items </p>  
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-8">
            {visibleProducts.map((p, index) => (
              <ProductCard 
                key={p.id}
                product={p}
                onNavigate={handleProductClick}
                priority={index < 5}
              />
            ))}
          </div>
          {hasMore && (
            <div ref={loadMoreRef} className="h-10 w-full" />
          )}



          <p className='font-bold mt-6'>Search by Category</p>  
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-8">
            {categories.map(c => (
              <CategoryCard
                key={c.id}
                category={c}
                onClick={() => handleCategoryClick(c.id)}
              />
            ))}
          </div>




          {/* <p className='font-bold mt-6'>Trending Items </p>  
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-8">
            {products.map(p => (
              <article
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/product/${p.id}`)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden flex flex-col cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform duration-500" 
                  />
                  {p.stockQuantity === 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">OUT OF STOCK</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{p.brand?.name || "N/A"}</span>
                  <h2 className="font-bold text-lg text-slate-800 mb-1">{p.name}</h2>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">${p.price}</span>
                    <span className="text-sm text-indigo-600 font-medium">View Details →</span>
                  </div>
                </div>
              </article>
            ))}
          </div> */}
        </div>
     </div>
  )
}
