import { Button } from "@/components/ui/button";
import { useEffect, useId, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { searchProducts } from '../redux/products/productActions';


const HandleFilter = () => {

};



const getBrandName = (product) => {
  if (typeof product.brandName === "string") return product.brandName;
  if (typeof product.brand === "string") return product.brand;
  return "";
};

const getCategoryName = (product) => {
  if (typeof product.categoryName === "string") return product.categoryName;
  if (typeof product.category === "string") return product.category;
  return "";
};

const getQuantity = (product) => {
  if (Number.isFinite(product.quantity)) return product.quantity;
  if (Number.isFinite(product.stockQuantity)) return product.stockQuantity;
  return 0;
};

const getPrice = (product) => {
  if (Number.isFinite(product.price)) return product.price;
  const parsed = Number(product.price);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function SearchProduct() {
  const uid = useId();
  const dispatch = useDispatch();

  const step = 1;

  const [value, setValue] = useState(0);
  const [includeOOS, setIncludeOOS] = useState(false);
  const [category, setCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [sortBy, setSortBy] = useState("Price");
  const [appliedFilters, setAppliedFilters] = useState(null);
  const navigate = useNavigate();
  const selectedBrandsArray = useMemo(
    () => Array.from(selectedBrands),
    [selectedBrands]
  );

  const applyFilters = () => {
    setAppliedFilters({
      value,
      includeOOS,
      category,
      selectedBrands: new Set(selectedBrands),
      sortBy,
    });
  };

  const { product_name } = useParams();
  const q = useMemo(() => {
    const raw = product_name ?? "";
    try {
      return decodeURIComponent(raw).trim();
    } catch {
      return raw.trim();
    }
  }, [product_name]);

  const searchResults = useSelector((state) => state.products?.searchResults ?? []);

  useEffect(() => {
    if (q) {
      dispatch(searchProducts(q));
    }
  }, [dispatch, q]);




  const { uniqueBrands, uniqueCategories } = useMemo(() => {
    const brandSet = new Set();
    const categorySet = new Set();

    for (const p of searchResults) {
      const brand = getBrandName(p);
      const category = getCategoryName(p);

      if (brand) brandSet.add(brand);
      if (category) categorySet.add(category);
    }

    return {
      uniqueBrands: Array.from(brandSet).sort(),
      uniqueCategories: Array.from(categorySet).sort(),
    };
  }, [searchResults]);



    
  const categoryOptions = useMemo(() => {
    return ["All", ...uniqueCategories];
  }, [uniqueCategories]);


  // get Min and Max Prices
  const { minPrice, maxPrice } = useMemo(() => {
    if (!searchResults.length) {
      return { minPrice: 0, maxPrice: 100 };
    }

    let minFound = Infinity;
    let maxFound = 0;

    for (const p of searchResults) {
      const price = getPrice(p);
      if (!Number.isFinite(price)) continue;
      if (price < minFound) minFound = price;
      if (price > maxFound) maxFound = price;
    }

    if (!Number.isFinite(minFound) || !Number.isFinite(maxFound)) {
      return { minPrice: 0, maxPrice: 100 };
    }

    return {
      minPrice: Math.floor(minFound),
      maxPrice: Math.ceil(maxFound),
    };
  }, [searchResults]);

  useEffect(() => {
    setValue(maxPrice);
  }, [maxPrice]);

  useEffect(() => {
    if (!categoryOptions.includes(category)) {
      setCategory("All");
    }
  }, [category, categoryOptions]);


  const filteredResults = useMemo(() => {
    // If the user hasn't applied filters yet, show raw search results
    if (!appliedFilters) return searchResults;

    const { value: appliedValue, includeOOS: appliedOOS, category: appliedCategory, selectedBrands: appliedSelectedBrands, sortBy: appliedSort } = appliedFilters;
    const normalizedCategory = appliedCategory;
    const hasCategoryFilter = normalizedCategory && normalizedCategory !== "All";
    const brandFilterActive = appliedSelectedBrands && appliedSelectedBrands.size > 0;

    const results = searchResults.filter((product) => {
      const price = getPrice(product);
      const quantity = getQuantity(product);
      const brandName = getBrandName(product);
      const categoryName = getCategoryName(product);

      if (!appliedOOS && quantity <= 0) return false;
      if (Number.isFinite(price) && price > appliedValue) return false;
      if (hasCategoryFilter && categoryName.toLowerCase() !== normalizedCategory.toLowerCase()) {
        return false;
      }
      if (brandFilterActive && !appliedSelectedBrands.has(brandName)) {
        return false;
      }
      return true;
    });

    if (appliedSort === "Price") {
      return results.slice().sort((a, b) => getPrice(a) - getPrice(b));
    }
    if (appliedSort === "Newest") {
      return results.slice().sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }

    return results;
  }, [searchResults, appliedFilters]);



  

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  };

  const resetFilters = () => {
    setValue(maxPrice);
    setIncludeOOS(false);
    setCategory("All");
    setSelectedBrands(new Set());
    setSortBy("Price");
    setAppliedFilters(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#A2A2A2]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-center gap-2"> 
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 lg:shrink-0">
            <div className="rounded-2xl bg-white/45 p-5 ring-1 ring-black/10 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Filters</div> 
              </div>

              <div className="mt-5 space-y-6">
                {/* Price */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-xs font-semibold text-slate-900">Price</div>
                    <div className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                      ${value}
                    </div>
                  </div>

                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step={step}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full accent-slate-900"
                    aria-label="Max price"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-slate-900/70">
                    <span>${minPrice}</span>
                    <span>${maxPrice}</span>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <div className="mb-2 text-xs font-semibold text-slate-900">Availability</div>
                  <label className="flex items-center gap-2 px-3 py-2 text-xs text-slate-900">
                    <input
                      type="checkbox"
                      checked={includeOOS}
                      onChange={(e) => setIncludeOOS(e.target.checked)}
                      className="h-4 w-4 accent-slate-900"
                    />
                    Include out of stock
                  </label>
                </div>

                {/* Category */}
                <div>
                  <div className="mb-2 text-xs font-semibold text-slate-900">Category</div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/20"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brands */}
                <div>
                  <div className="mb-2 text-xs font-semibold text-slate-900">Brands</div>

                  <div className="grid grid-cols-1 gap-2">
                    {uniqueBrands.map((b) => {
                      const checkboxId = `${uid}-${b.replace(/\s+/g, "-").toLowerCase()}`;
                      const checked = selectedBrands.has(b);

                      return (
                        <label
                          key={b}
                          htmlFor={checkboxId}
                          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition">
                        
                          <input
                            id={checkboxId}
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleBrand(b)}
                            className="h-4 w-4 accent-slate-900"
                          />
                          <span className="truncate">{b}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button onClick={applyFilters} className="h-10 flex-1 rounded-xl bg-slate-900 text-white hover:bg-slate-950">
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-black/15 bg-white/40 text-slate-900 hover:bg-white/55"
                    onClick={resetFilters}
                    type="button"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1">
            <div className="rounded-2xl bg-white/92 p-6 shadow-lg ring-1 ring-black/10 backdrop-blur">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
                <div className="text-sm text-slate-800"> 
                            <div className="text-xs font-semibold tracking-wide text-slate-900/80">
                              Search Results
                            </div>
            <div className="text-lg font-semibold text-slate-900">
              {q || "Search"}
            </div>
                            <div className="mt-1 text-xs text-slate-900/70">
                              Showing {filteredResults.length} items
                            </div>

                            </div>
                                <div className="gap-2 rounded-xl bg-white/40 px-3 py-2 ring-1 ring-black/10 backdrop-blur">
                                  <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="h-8 px-2 text-xs text-slate-900 outline-none focus:border-slate-400 "
                                  >
                                    <option>Price</option>
                                    <option>Newest</option>
                                    <option>Rating</option>
                                </select>
                           </div>
              </div>

              {filteredResults.length === 0 ? (
                <div className="mt-10 text-center text-sm text-slate-700">
                  No items match your search and filters.
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {filteredResults.map((product) => {
                    const isOutOfStock = getQuantity(product) <= 0;
                    const brandName = getBrandName(product);

                    return (
                      <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:cursor-pointer hover:shadow-md"
                      >
                        <div className="relative h-32 bg-slate-200/70">
                          <img
                            src={
                              product.image ||
                              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"
                            }
                            alt={product.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          {isOutOfStock && (
                            <div className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-[10px] font-semibold text-white">
                              OUT OF STOCK
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {brandName || "N/A"}
                          </div>
                          <div className="mt-1 text-sm font-semibold text-slate-900">
                            {product.name}
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-slate-700">
                            <span>${getPrice(product).toFixed(2)}</span>
                            <span>{isOutOfStock ? "0 left" : `${getQuantity(product)} left`}</span>
                          </div>
                        </div>
                        <div className="border-t border-slate-200 p-3">
                          <button
                            type="button"
                            className="w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900/25"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  className="h-10 rounded-xl border-black/15 bg-white text-slate-900 hover:bg-slate-50"
                  type="button"
                >
                  Load More
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
