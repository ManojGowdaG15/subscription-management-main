import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiChevronRight, FiZap } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.1),transparent_50%)]"></div>

      <div className="w-full max-w-md">
        <div className="glass-card p-10 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-6 shadow-[0_0_30px_rgba(229,9,20,0.4)]">
              <FiZap className="text-white text-3xl" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter italic uppercase">
              Welcome <span className="text-red-600">Back</span>
            </h2>
            <p className="text-gray-500 mt-2 font-light">Enter your credentials to access StreamHub</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="input-premium pl-12"
                />
              </div>

              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="input-premium pl-12"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-gray-400">
              <label className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-red-600 focus:ring-red-600/20" />
                <span>Remember Me</span>
              </label>
              <a href="#" className="hover:text-red-600 transition-colors">Forgot PWD?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full flex items-center justify-center space-x-2 py-4"
            >
              <span>{loading ? 'SIGNING IN...' : 'SIGN IN'}</span>
              {!loading && <FiChevronRight />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm font-light">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-black hover:text-red-600 transition-colors underline-offset-4 underline decoration-red-600/30">
                JOIN NOW
              </Link>
            </p>
          </div>

          {/* Demo Acc Hint */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-[10px] font-black tracking-[4px] uppercase text-gray-600 text-center mb-4">Demo Access</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormData({ email: 'admin@example.com', password: 'admin123' })}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-all group"
              >
                <p className="text-[10px] font-bold text-gray-500 group-hover:text-white">ADMIN</p>
              </button>
              <button
                onClick={() => setFormData({ email: 'user@example.com', password: 'user123' })}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-all group"
              >
                <p className="text-[10px] font-bold text-gray-500 group-hover:text-white">MEMBER</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

