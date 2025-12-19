import React from "react";

export default function ProductDetailsMock() {
  const product = {
    title: "Harry Potter and the Seven Dwarves",
    category: "jewelry",
    brand: "Adidas",
    price: 10,
    qtyAvailable: 2,
    description:
      "This is just a description that is over multiple line, I didn’t want to make it a\nsingle line so I keep typing. THE MEME IS OER\nThis is just a description that is over multiple line, I didn’t want to make it a\nsingle line so I keep typing. THE MEME IS OER\nThis is just a description that is over multiple line, I didn’t want to make it a\nsingle line so I keep typing. THE MEME IS OER\nThis is just a description that is over multiple line, I didn’t want to make it a\nsingle line so I keep typing. THE MEME IS OER",
  };

  return (
    <div className="min-h-screen bg-gray-300 p-8">
      <div className="mx-auto w-full max-w-6xl bg-white shadow-md">
        {/* top bar */}
        <div className="h-10 bg-gray-400" />

        <div className="px-10 py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_1fr] lg:gap-16">
            {/* LEFT */}
            <div>
              <div className="h-64 w-full rounded-md bg-gray-200" />

              <div className="mt-16 space-y-2 text-xl leading-tight">
                <div>Price:</div>
                <div>Quantity Avaliable:</div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <h1 className="text-center text-4xl font-medium tracking-tight">
                {product.title}
              </h1>

              <div className="mx-auto mt-10 max-w-xl text-sm">
                <div className="space-y-1">
                  <div>
                    <span className="mr-2">Category:</span>
                    <span className="capitalize">{product.category}</span>
                  </div>
                  <div>
                    <span className="mr-2">Brand:</span>
                    <span>{product.brand}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-1">
                  <div>
                    <span className="mr-1">Price:</span>
                    <span>${product.price}</span>
                  </div>
                  <div>
                    <span className="mr-2">Quantity Avaliable:</span>
                    <span>{product.qtyAvailable}</span>
                  </div>
                </div>

                <div className="mt-10 text-sm font-medium">Description</div>

                <div className="mt-3 rounded-md bg-gray-200 p-6">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-900">
                    {product.description}
                  </pre>
                </div>

                <div className="mt-10 flex items-center justify-end gap-4">
                  {/* quantity dropdown */}
                  <div className="relative">
                    <select className="h-10 w-28 appearance-none rounded-md border border-gray-500 bg-gray-200 px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-gray-400">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
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

                  <button className="h-10 rounded-md bg-gray-200 px-5 text-sm font-medium text-gray-900 hover:bg-gray-300">
                    Add to Cart
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
