// Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Top gray section */}
      <div className="bg-[#A2A2A2]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Column 1 */}
            <div className="flex items-start">
              <Link to="/" className="text-slate-900 hover:underline">
                Home
              </Link>
            </div>

            {/* Column 2 */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-slate-900">Quick Links</h3>
              {/* add links here if needed */}
            </div>

            {/* Column 3 */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-slate-900">Who we are</h3>
              {/* add links here if needed */}
            </div>

            {/* Column 4 */}
            <div className="md:text-left">
              <h3 className="font-semibold text-slate-900">Help</h3>
              <div className="mt-3">
                <Link to="/contact" className="text-slate-900 hover:underline">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom black bar */}
      <div className="bg-black h-10" />
    </footer>
  );
}
