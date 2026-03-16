import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiCreditCard, FiDownload, FiRefreshCw, FiZap, FiActivity } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { subscriptionAPI } from '../../services/api';
import { format, differenceInDays } from 'date-fns';
import { downloadInvoice } from '../../utils/downloadHelper';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserDashboard = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subResponse, historyResponse] = await Promise.all([
        subscriptionAPI.getCurrent(),
        subscriptionAPI.getHistory()
      ]);
      setSubscription(subResponse.data.subscription);
      setHistory(historyResponse.data.subscriptions);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel? You will lose access to premium features.')) return;
    setCancelling(true);
    try {
      await subscriptionAPI.cancel();
      toast.success('Subscription cancelled');
      await fetchData();
    } catch (error) {
      toast.error('Failed to cancel');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const daysRemaining = subscription
    ? differenceInDays(new Date(subscription.endDate), new Date())
    : 0;

  const getTierPerks = (tierName) => {
    const name = tierName?.toLowerCase();
    if (name === 'pro') return { quality: '4K Ultra HDR', devices: 'Unlimited', library: 'Total Access' };
    if (name === 'premium') return { quality: '1080p FHD', devices: '3 Devices', library: 'Premium+' };
    return { quality: '720p SD', devices: '1 Device', library: 'Basic' };
  };

  const perks = getTierPerks(subscription?.plan?.name);

  return (
    <div className="py-10 space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white">
            HELLO, <span className="text-red-600">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-500 font-light mt-1">Manage your premium space and billing</p>
        </div>
        <div className="flex items-center space-x-4">
          {!subscription && (
            <Link to="/plans" className="btn-premium flex items-center space-x-2">
              <FiZap />
              <span>GO PREMIUM</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Card */}
        <div className="lg:col-span-2 glass-card p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <FiActivity className="text-9xl text-red-600" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-black tracking-[4px] uppercase text-gray-500">Current Plan</h2>
              {subscription && (
                <span className="status-active animate-pulse">● Active</span>
              )}
            </div>

            {subscription ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-5xl font-black italic tracking-tighter text-white uppercase">{subscription.plan.name}</h3>
                  <p className="text-gray-400 mt-2">Billed {subscription.plan.duration}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5">
                  <div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Quality Node</p>
                    <p className="text-white font-bold">{perks.quality}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Time Left</p>
                    <p className="text-red-500 font-black italic">{daysRemaining} DAYS</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Access Depth</p>
                    <p className="text-white font-bold">{perks.library}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Link Limit</p>
                    <p className="text-white font-bold uppercase">{perks.devices}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                    className="px-6 py-2 bg-white/5 hover:bg-red-600/10 hover:text-red-500 rounded-full text-xs font-bold transition-all border border-white/5"
                  >
                    {cancelling ? 'CANCELLING...' : 'CANCEL SUBSCRIPTION'}
                  </button>
                  <Link to="/plans" className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold transition-all shadow-lg shadow-red-600/20">
                    UPGRADE PLAN
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <FiZap className="text-5xl text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 font-light mb-6">No active subscription found. Unlock features today.</p>
                <Link to="/plans" className="btn-premium">BROWSE PLANS</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mini Actions/Info */}
        <div className="space-y-8">
          <div className="glass-card p-6 border-l-4 border-l-red-600">
            <h4 className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Quick Insights</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Streaming Hours</span>
                <span className="text-white font-bold">124.5h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Active Devices</span>
                <span className="text-white font-bold italic">3/Unlimited</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 w-[65%]"></div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Latest Invoices</h4>
            {subscription ? (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-600/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-600 hover:text-white transition-all shadow-md shadow-red-600/20"
                    onClick={() => downloadInvoice({
                      id: subscription._id.substr(-6).toUpperCase(),
                      date: format(new Date(subscription.startDate), 'MMM dd, yyyy'),
                      planName: subscription.plan.name,
                      price: (subscription.pricePaid / (1 - (subscription.discountPercentage / 100))).toFixed(2),
                      discount: (subscription.pricePaid * (subscription.discountPercentage / 100) / (1 - (subscription.discountPercentage / 100))).toFixed(2),
                      total: subscription.pricePaid
                    })}
                  >
                    <FiDownload className="text-sm" />
                  </div>
                  <span className="text-xs font-bold text-gray-300">{format(new Date(subscription.startDate), 'MMM yyyy')}</span>
                </div>
                <span className="text-xs font-black italic">₹{subscription.pricePaid}</span>
              </div>
            ) : (
              <p className="text-xs text-gray-600 text-center py-2 italic font-light">No billing history yet</p>
            )}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xs font-black tracking-[4px] uppercase text-gray-500">Subscription History</h2>
          <FiActivity className="text-gray-500" />
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="p-6 text-[10px] font-black tracking-widest text-gray-500 uppercase">Plan</th>
                  <th className="p-6 text-[10px] font-black tracking-widest text-gray-500 uppercase">Period</th>
                  <th className="p-6 text-[10px] font-black tracking-widest text-gray-500 uppercase">Status</th>
                  <th className="p-6 text-[10px] font-black tracking-widest text-gray-500 uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((sub) => (
                  <tr key={sub._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <p className="text-white font-bold italic uppercase tracking-tighter">{sub.plan?.name}</p>
                    </td>
                    <td className="p-6 text-sm text-gray-400 font-light">
                      {format(new Date(sub.startDate), 'MMM dd')} - {format(new Date(sub.endDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-6">
                      <span className={sub.status === 'ACTIVE' ? 'status-active' : sub.status === 'CANCELLED' ? 'status-cancelled' : 'status-expired'}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <p className="text-white font-black italic">₹{sub.pricePaid}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-600 italic font-light text-sm">Your history is clear. Start your story today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

