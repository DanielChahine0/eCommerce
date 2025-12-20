import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/products/productActions'
import { Link, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import ProductSkeleton from '../components/ProductSkeleton';

export default function Catalog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.products);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([])
  
  // State for search, filter, and sort
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortConfig, setSortConfig] = useState('newest')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        await dispatch(fetchProducts());
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [dispatch]);

  useEffect(() => {
    // Mock categories - in production, fetch from API
    const categories = [
      { id: "101", name: "Jewelry", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
      { id: "102", name: "Books", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
      { id: "103", name: "Tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
      { id: "104", name: "Clothes", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
      { id: "105", name: "Sports", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
    ];
    setCategories(categories);
  }, []);


  if (loading) return <div className="text-center py-20">Loading Catalogue...</div>;

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
          <p className='font-bold'>Trending Items </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            
            {/* 2. Show Skeletons while loading */}
            {loading ? (
              // Create an array of 10 items to map over
              [...Array(10)].map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              // 3. Render actual products
              products.map(p => (
                <article
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 overflow-hidden flex flex-col cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={p.image || "..."} 
                      alt={p.name}
                      loading="lazy" 
                      decoding="async"
                      // Add this specific inline style:
                      style={{ 
                        transform: 'translate3d(0, 0, 0)', 
                        contentVisibility: 'auto' 
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    {p.stockQuantity === 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">OUT OF STOCK</div>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{p.brand?.name || "N/A"}</span>
                    <h2 className="font-bold text-lg text-slate-800 mb-1 truncate">{p.name}</h2>
                    <div className="mt-auto">
                      <span className="text-xl font-bold text-slate-900">${p.price}</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

                    <p className='font-bold mt-6'>Search by Category</p>  
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-8">
            {categories.map(p => (
              <article
                key={p.id}
                role="button"
                tabIndex={0}
                //need to link to category page
                onClick={() => navigate(`/product/${p.id}`)}
                // onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/product/${p.id}`) }}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden flex flex-col cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                    <img 
                      src={p.image || "..."} 
                      alt={p.name}
                      loading="lazy" 
                      decoding="async"
                      // Add this specific inline style:
                      style={{ 
                        transform: 'translate3d(0, 0, 0)', 
                        contentVisibility: 'auto' 
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="font-bold text-lg text-slate-800 mb-1">{p.name}</h2>
                  <div className="mt-auto flex items-center justify-between"></div>
                </div>
              </article>
            ))}
          </div>

        </div>
     </div>
  )
}