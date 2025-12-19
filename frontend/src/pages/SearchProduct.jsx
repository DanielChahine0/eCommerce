import { Button } from "@/components/ui/button";
import { useId, useMemo, useState } from "react";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const categories = ["Electronics", "Books", "Clothes", "Sports", "Home", "Toys"];
const brands = ["Adidas", "Nike", "Puma", "Reebok", "Under Armour"];

export default function SearchProduct() {
  const uid = useId();

  const min = 1;
  const max = 100;
  const step = 1;

  const [value, setValue] = useState(7);
  const [includeOOS, setIncludeOOS] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [sortBy, setSortBy] = useState("Price");

  const selectedBrandsArray = useMemo(
    () => Array.from(selectedBrands),
    [selectedBrands]
  );

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  };

  const resetFilters = () => {
    setValue(7);
    setIncludeOOS(false);
    setCategory(categories[0]);
    setSelectedBrands(new Set());
    setSortBy("Price");
  };

  return (
    <div className="min-h-screen w-full bg-[#A2A2A2]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-900/80">
              Search Results
            </div>
            <div className="text-lg font-semibold text-slate-900">
              Harry Potter and the Seven Dwarves
            </div>
            <div className="mt-1 text-xs text-slate-900/70">
              Showing {cards.length} items
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-xl bg-white/40 px-3 py-2 text-xs text-slate-900 ring-1 ring-black/10 backdrop-blur">
              <span className="font-semibold">Max price:</span> ${value}
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/40 px-3 py-2 ring-1 ring-black/10 backdrop-blur">
              <span className="text-xs text-slate-900">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/20"
              >
                <option>Price</option>
                <option>Newest</option>
                <option>Rating</option>
              </select>
            </div>

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

        {/* Layout */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 lg:shrink-0">
            <div className="rounded-2xl bg-white/45 p-5 ring-1 ring-black/10 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Filters</div>
                <div className="text-[11px] text-slate-900/70">
                  {selectedBrands.size > 0 ? `${selectedBrands.size} brands` : "No brands selected"}
                </div>
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
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full accent-slate-900"
                    aria-label="Max price"
                  />

                  <div className="mt-2 flex justify-between text-[11px] text-slate-900/70">
                    <span>${min}</span>
                    <span>${max}</span>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <div className="mb-2 text-xs font-semibold text-slate-900">Availability</div>
                  <label className="flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 text-xs text-slate-900 ring-1 ring-black/10">
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
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brands */}
                <div>
                  <div className="mb-2 text-xs font-semibold text-slate-900">Brands</div>

                  <div className="grid grid-cols-2 gap-2">
                    {brands.map((b) => {
                      const checkboxId = `${uid}-${b.replace(/\s+/g, "-").toLowerCase()}`;
                      const checked = selectedBrands.has(b);

                      return (
                        <label
                          key={b}
                          htmlFor={checkboxId}
                          className={[
                            "flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs ring-1 transition",
                            checked
                              ? "bg-slate-900 text-white ring-slate-900"
                              : "bg-white/55 text-slate-900 ring-black/10 hover:bg-white/70",
                          ].join(" ")}
                        >
                          <input
                            id={checkboxId}
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleBrand(b)}
                            className="h-4 w-4 accent-white"
                          />
                          <span className="truncate">{b}</span>
                        </label>
                      );
                    })}
                  </div>

                  {selectedBrandsArray.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedBrandsArray.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => toggleBrand(b)}
                          className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-[11px] text-slate-900 ring-1 ring-black/10 hover:bg-white/75"
                          aria-label={`Remove brand ${b}`}
                        >
                          <span className="max-w-[12rem] truncate">{b}</span>
                          <span className="text-slate-900/70">×</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="h-10 flex-1 rounded-xl bg-slate-900 text-white hover:bg-slate-950">
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
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-800">
                  Category: <span className="font-semibold">{category}</span>{" "}
                  <span className="text-slate-500">•</span>{" "}
                  <span className="text-slate-700">{includeOOS ? "Including OOS" : "In-stock only"}</span>
                </div>

                {selectedBrandsArray.length > 0 ? (
                  <div className="text-xs text-slate-700">
                    Brands:{" "}
                    <span className="font-semibold">
                      {selectedBrandsArray.slice(0, 2).join(", ")}
                      {selectedBrandsArray.length > 2 ? ` +${selectedBrandsArray.length - 2}` : ""}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600">All brands</div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {cards.map((n) => (
                  <div
                    key={n}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="h-32 bg-slate-200/70" />
                    <div className="p-3">
                      <div className="h-3 w-4/5 rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
                      <div className="mt-3 flex items-center justify-between">
                        <div className="h-6 w-16 rounded-full bg-slate-900/10" />
                        <div className="h-6 w-10 rounded-full bg-slate-900/10" />
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
                ))}
              </div>

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
