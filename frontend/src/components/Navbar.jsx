import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const publicNavLinks = [
  { label: "Home", to: "/" },
  { label: "Find a Place", to: "/browse" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDFB] border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
            {[...publicNavLinks, ...(user?.role === "owner" ? [{ label: "For Owners", to: "/for-owners" }] : [])].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-orange-500 bg-orange-100"
                      : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3E8E2]"
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

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-orange-400 transition-colors text-sm text-[#1F2937]"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user.profilePicture ? (
                      <img
                        src={`${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "")}${user.profilePicture}`}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-[#E5E7EB]">
                      <p className="text-sm font-semibold text-[#1F2937] truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-[#6B7280] capitalize">
                        {user.role === "owner" ? "Bodim Owner" : user.role}
                      </p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-violet-600 hover:bg-violet-50 transition-colors font-medium"
                      >
                        <ShieldCheck size={15} /> Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1F2937] hover:bg-[#F3E8E2] transition-colors"
                    >
                      <User size={15} /> My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
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
            {[...publicNavLinks, ...(user?.role === "owner" ? [{ label: "For Owners", to: "/for-owners" }] : [])].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-orange-500 bg-orange-100"
                      : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3E8E2]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
            {user ? (
              <div className="flex-1 flex flex-col gap-2">
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-2 text-sm font-medium text-center text-violet-600 border border-violet-300 rounded-lg hover:bg-violet-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={15} /> Admin Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2 text-sm font-medium text-center text-[#1F2937] border border-[#E5E7EB] rounded-lg hover:border-orange-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <User size={15} /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-sm font-medium text-center text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
