import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiHome,
  FiGrid,
  FiShield,
  FiCreditCard,
  FiZap
} from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'EXPLORE', icon: FiHome },
    { to: '/browse', label: 'BROWSE', icon: FiGrid },
    { to: '/plans', label: 'PLANS', icon: FiCreditCard },
    ...(isAuthenticated ? [
      { to: '/dashboard', label: 'MY SPACE', icon: FiUser },
    ] : []),
    ...(isAdmin ? [
      { to: '/admin/dashboard', label: 'ADMIN', icon: FiShield }
    ] : [])
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled || isOpen ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(229,9,20,0.5)]">
              <FiZap className="text-white text-2xl font-black" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">
              STREAM<span className="text-red-600">HUB</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs font-black tracking-widest transition-all duration-300 hover:text-red-600 ${isActive(link.to) ? 'text-red-600' : 'text-gray-400'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-2 text-xs font-black tracking-widest text-gray-400 hover:text-white transition-colors"
              >
                <FiLogOut className="text-lg group-hover:text-red-600 transition-colors" />
                <span>LOGOUT</span>
              </button>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="text-xs font-black tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                >
                  JOIN NOW
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isOpen ? <FiX className="w-8 h-8" /> : <FiMenu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen mt-8 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="flex flex-col space-y-6 pb-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`text-xl font-black tracking-tighter italic ${isActive(link.to) ? 'text-red-600' : 'text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px w-full bg-white/5 my-4"></div>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full py-4 bg-red-600 text-white font-black tracking-widest rounded-xl italic"
              >
                LOGOUT
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="py-4 border border-white/10 text-center text-white font-black tracking-widest rounded-xl italic"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="py-4 bg-red-600 text-center text-white font-black tracking-widest rounded-xl italic shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                >
                  JOIN NOW
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
