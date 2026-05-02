import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Browse', to: '/browse' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'For Owners', to: '/for-owners' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDFB] border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-[#1F2937] font-bold text-lg tracking-wide">
              BODIM <span className="text-orange-500">FINDER</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-orange-500 bg-orange-100'
                      : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3E8E2]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors px-2 py-1.5 rounded-lg hover:bg-[#F3E8E2]">
              <Globe size={15} />
              <span>EN</span>
              <ChevronDown size={13} />
            </button>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-[#1F2937] border border-[#E5E7EB] rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3E8E2]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-[#FFFDFB] px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-orange-500 bg-orange-100'
                      : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3E8E2]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2 text-sm font-medium text-center text-[#1F2937] border border-[#E5E7EB] rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2 text-sm font-medium text-center text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
