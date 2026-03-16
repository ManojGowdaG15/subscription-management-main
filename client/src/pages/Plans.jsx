import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiStar, FiInfo, FiZap, FiTv, FiSmile, FiUnlock, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { planAPI, subscriptionAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await planAPI.getAll();
      setPlans(response.data.plans);
    } catch (error) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      toast.error('Identity verification required');
      navigate('/login');
      return;
    }

    if (user?.currentSubscription?.plan?._id === planId) {
      toast.error('Identity Conflict: Already synchronized on this tier');
      navigate('/dashboard');
      return;
    }

    // Redirect to creative checkout process
    navigate(`/checkout/${planId}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="py-20">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic">
          READY TO <span className="text-red-600">UPGRADE?</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
          Choose the experience that's right for you. Change or cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 mb-24">
        {plans.map((plan, index) => (
          <div
            key={plan._id}
            className={`glass-card relative flex flex-col p-1 group transition-all duration-500 hover:scale-105 ${index === 1
              ? 'border-red-600/50 scale-105 shadow-[0_0_50px_rgba(229,9,20,0.2)]'
              : index === 2
                ? 'border-yellow-600/50 shadow-[0_0_50px_rgba(202,138,4,0.15)] bg-gradient-to-br from-yellow-600/5 to-transparent'
                : ''
              }`}
          >
            {index === 1 && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(229,9,20,0.5)]">
                Most Popular
              </div>
            )}
            {index === 2 && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-600 text-black px-6 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(202,138,4,0.5)]">
                Elite Protocol
              </div>
            )}

            <div className="p-10 flex-grow">
              <div className="flex items-center space-x-3 mb-6">
                {index === 0 && <FiUnlock className="text-gray-400 text-2xl" />}
                {index === 1 && <FiZap className="text-red-500 text-2xl" />}
                {index === 2 && <FiActivity className="text-yellow-600 text-2xl" />}
                <h3 className="text-2xl font-black italic tracking-tighter uppercase">{plan.name}</h3>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-6xl font-black tracking-tighter">₹{plan.price}</span>
                  <span className="text-gray-500 ml-2 font-medium">/{plan.duration}</span>
                </div>
                <p className="text-gray-400 mt-4 font-light text-lg">{plan.description}</p>
              </div>

              <div className="h-px w-full bg-white/5 mb-8"></div>

              <ul className="space-y-4 mb-10">
                {plan.features?.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3 text-gray-300">
                    <div className="flex-shrink-0 w-5 h-5 bg-red-600/10 rounded-full flex items-center justify-center">
                      <FiCheck className="text-red-600 text-xs" />
                    </div>
                    <span className="text-sm font-medium tracking-wide">{feature}</span>
                  </li>
                ))}
                {/* Fallback mock features if none in DB */}
                {!plan.features && (
                  <>
                    <li className="flex items-center space-x-3 text-gray-300">
                      <FiCheck className="text-red-600 flex-shrink-0" />
                      <span className="text-sm">Unlimited streaming on all devices</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-300">
                      <FiCheck className="text-red-600 flex-shrink-0" />
                      <span className="text-sm">Offline viewing available</span>
                    </li>
                    <li className="flex items-center space-x-3 text-gray-300">
                      <FiCheck className="text-red-600 flex-shrink-0" />
                      <span className="text-sm font-medium">Ultra HD 4K Support</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe(plan._id)}
              disabled={subscribing || user?.currentSubscription?.plan?._id === plan._id}
              className={`m-4 py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 shadow-lg ${index === 1
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                : 'bg-white/10 hover:bg-white/20 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95`}
            >
              {subscribing ? (
                'Processing...'
              ) : user?.currentSubscription?.plan?._id === plan._id ? (
                'Current Tier Active'
              ) : (
                'Choose Plan'
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Comparison Table Section */}
      <section className="mt-32 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">Detailed Comparison</h2>
          <div className="h-1 w-20 bg-red-600 mx-auto"></div>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-6 text-gray-400 font-bold uppercase text-xs tracking-widest">Plan Features</th>
                {plans.map(p => (
                  <th key={p._id} className="p-6 text-center font-black uppercase tracking-tighter text-lg">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="p-6 text-gray-300 text-sm">Monthly Price</td>
                {plans.map(p => (
                  <td key={p._id} className="p-6 text-center text-xl font-bold">₹{p.price}</td>
                ))}
              </tr>
              <tr>
                <td className="p-6 text-gray-300 text-sm">Video Quality</td>
                <td className="p-6 text-center text-gray-400">Standard</td>
                <td className="p-6 text-center">Full HD</td>
                <td className="p-6 text-center text-red-500 font-bold">4K + HDR</td>
              </tr>
              <tr>
                <td className="p-6 text-gray-300 text-sm">Concurrent Streams</td>
                <td className="p-6 text-center">1</td>
                <td className="p-6 text-center">3</td>
                <td className="p-6 text-center text-white font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="p-6 text-gray-300 text-sm">Download for Offline</td>
                <td className="p-6 text-center text-gray-600"><FiStar /></td>
                <td className="p-6 text-center text-red-500"><FiCheck className="mx-auto" /></td>
                <td className="p-6 text-center text-red-500"><FiCheck className="mx-auto text-2xl" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-8 text-center text-gray-500 text-sm flex items-center justify-center space-x-2">
          <FiInfo />
          <span>HD and 4K Ultra HD availability subject to your internet service and device capabilities.</span>
        </p>
      </section>
    </div>
  );
};

export default Plans;

