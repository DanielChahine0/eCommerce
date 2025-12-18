import { useEffect, useState, useMemo } from 'react'
import { api } from '../api/api'
import { Link } from 'react-router-dom'

export default function Catalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State for search, filter, and sort
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortConfig, setSortConfig] = useState('newest')

  useEffect(() => {
    // In production, use api('/api/products')
    // Simulating API fetch with mock data that includes category/brand/inventory
    const data = [
      { id: "101", name: "Lunar Gray Headphones", price: 199, category: "Electronics", brand: "Sony", quantity: 5, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
      { id: "102", name: "Slate Desk Organizer", price: 45, category: "Office", brand: "Nomad", quantity: 12, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800" },
      { id: "103", name: "Obsidian Smart Watch", price: 349, category: "Electronics", brand: "Apple", quantity: 3, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
      { id: "104", name: "Ceramic Drip Kettle", price: 85, category: "Kitchen", brand: "Fellow", quantity: 0, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800" }
    ];
    setProducts(data);
    setLoading(false);
  }, []);

  // Filter and Sort Logic
  const processedProducts = useMemo(() => {
    let filtered = products.filter(p => 
      (categoryFilter === 'All' || p.category === categoryFilter) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()))
    );

    if (sortConfig === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortConfig === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortConfig === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [products, search, categoryFilter, sortConfig]);

  if (loading) return <div className="text-center py-20">Loading Catalogue...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Search and Sort Bar */}
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {processedProducts.map(p => (
          <Link key={p.id} to={`/product/${p.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden flex flex-col">
            <div className="aspect-[4/3] relative">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {p.quantity === 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">OUT OF STOCK</div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{p.brand}</span>
              <h2 className="font-bold text-lg text-slate-800 mb-1">{p.name}</h2>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xl font-bold text-slate-900">${p.price}</span>
                <span className="text-sm text-indigo-600 font-medium">View Details →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}