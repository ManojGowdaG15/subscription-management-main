import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiChevronRight, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (formData.password.length < 6) return toast.error('Password too short');

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-32 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute bottom-0 right-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_70%_70%,rgba(67,56,202,0.1),transparent_50%)]"></div>

      <div className="w-full max-w-md">
        <div className="glass-card p-10 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-6 shadow-[0_0_30px_rgba(229,9,20,0.4)] transition-transform hover:rotate-12">
              <FiZap className="text-white text-3xl" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter italic uppercase">
              Start your <span className="text-red-600">Journey</span>
            </h2>
            <p className="text-gray-500 mt-2 font-light text-sm tracking-wide">Unlimited access is just 30 seconds away.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="input-premium pl-12"
                />
              </div>

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
                  placeholder="Create Password"
                  className="input-premium pl-12"
                />
              </div>

              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="input-premium pl-12"
                />
              </div>
            </div>

            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[2px] leading-relaxed">
              By joining, you agree to our <span className="text-gray-400">Terms of Service</span> & <span className="text-gray-400">Privacy Policy</span>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full flex items-center justify-center space-x-2 py-4 mt-4"
            >
              <span>{loading ? 'CREATING SPACE...' : 'JOIN STREAMHUB'}</span>
              {!loading && <FiChevronRight />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm font-light">
              Already a member?{' '}
              <Link to="/login" className="text-white font-black hover:text-red-600 transition-colors underline-offset-4 underline decoration-red-600/30">
                SIGN IN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

