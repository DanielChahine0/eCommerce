import { Button } from "@/components/ui/button";
import { useId, useState } from "react";


const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9,10];
const categories = ['Electronics', 'Books', 'Clothes', 'Sports', 'Home', 'Toys'];
const brands = ['Adidas', 'Nike', 'Puma', 'Reebok', 'Under Armour'];


export default function SearchProduct() {
  const id = useId();
  const [value, setValue] = useState(7);
  const min = 1;
  const max = 100;
  const step = 1;

  return(

    <div className="bg-[#A2A2A2]">
            <div className="max-w-7xl w-full bg-[#A2A2A2] mx-auto flex flex-col">
      <div className="h-10 w-full bg-[#A2A2A2]" />

      <div className="flex">
        {/* left sidebar strip */}
        <aside className="w-64 [&>div]:mt-2 bg-[#A2A2A2]">

                <div>
                    <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
                        Price Range: ${value}
                    </label>
                    <input
                        id={id}
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        className="mt-3 w-full accent-indigo-600"
                    />
                </div>

                <div>
                    <p>Avaliability</p>
                    <input type="checkbox" id="inStock" name="inStock" value="inStock"/>
                    <label className='ml-2' htmlFor="inStock">Include Out of Stock</label>
                </div>
                
                <div>
                    <p>Category</p>
                    <select name="category" id="category" className="rounded-md border border-slate-300 bg-white px-2 ml-2 py-1 text-sm">
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>


                <div>
                    <p>Brands</p>
                    {brands.map((b) => {
                        const id = `brand-${b}`; // or `brand-${index}` if b can repeat
                        return (
                        <div key={b} className="flex items-center">
                            <input id={id} name="brands" type="checkbox" value={b} />
                            <label htmlFor={id} className="ml-2">{b}</label>
                        </div>
                        );
                    })}
                </div>

                <Button>
                    Apply Filters
                </Button>
                
        </aside>






        {/* main area with centered white canvas */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-5xl bg-white px-10 py-8">
            {/* header row */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-900">
                Results for: <span className="font-medium">Harry Potter and the Seven Dwarves</span>
              </p>

              <label className="flex items-center gap-2 text-sm text-slate-900">
                <span>Sort by:</span>
                <select className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm">
                  <option>Price</option>
                  <option>Title</option>
                  <option>Newest</option>
                </select>
              </label>
            </div>

            {/* grid */}
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {cards.map((id) => (
                <div
                  key={id}
                  className="aspect-square rounded-xl bg-slate-200"
                />
              ))}
            </div>  
            <div className="mt-10 flex justify-center">
              <button className="rounded-md border border-slate-400 bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200">
                Load More
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
    </div>
  );


    
}
