import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/products/productActions'
import { Link, useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
} from "@/components/ui/card"

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
            {products.map(p => (
              <article
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/product/${p.id}`)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden flex flex-col cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={p.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"} 
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
                  </div>
                </div>
              </article>
            ))}
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
                <div className="relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="font-bold text-lg text-slate-800 mb-1">{p.name}</h2>
                  <div className="mt-auto flex items-center justify-between"></div>
                </div>
              </article>
            ))}
          </div>




          <p className='font-bold mt-6'>Trending Items </p>  
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-5 gap-8">
            {products.map(p => (
              <article
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/product/${p.id}`)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden flex flex-col cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={p.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"} 
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
          </div>
        </div>
     </div>
  )
}