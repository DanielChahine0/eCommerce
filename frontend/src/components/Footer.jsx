// Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full mt-12">
      <div className="bg-slate-950 text-slate-200 border-t border-slate-800">
        <div className="bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid gap-10 md:grid-cols-6">
              <div className="md:col-span-2">
                <p className="text-2xl font-display font-semibold text-white">EStore</p>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Curated essentials, fast checkout, and clear order tracking. Shop with confidence and manage everything in one place.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200 hover:border-slate-500 hover:text-white transition"
                  >
                    Browse
                  </Link>
                  <Link
                    to="/cart"
                    className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition"
                  >
                    View Cart
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Shop</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <Link to="/" className="block hover:text-white transition">Catalog</Link>
                  <Link to="/orders" className="block hover:text-white transition">Order History</Link>
                  <Link to="/checkout" className="block hover:text-white transition">Checkout</Link>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Account</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <Link to="/profile" className="block hover:text-white transition">Profile</Link>
                  <Link to="/login" className="block hover:text-white transition">Sign In</Link>
                  <Link to="/register" className="block hover:text-white transition">Create Account</Link>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Help</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <a href="mailto:support@estore.com" className="block hover:text-white transition">Support Email</a>
                  <a href="tel:+14165550101" className="block hover:text-white transition">Call Support</a>
                  <Link to="/orders" className="block hover:text-white transition">Returns</Link>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Admin</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <Link to="/admin" className="block hover:text-white transition">Dashboard</Link>
                  <Link to="/admin" className="block hover:text-white transition">Inventory</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs text-slate-400">
              <span>Copyright 2025 EStore. All rights reserved.</span>
              <span>Fast shipping. Secure payments. Responsive support.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
