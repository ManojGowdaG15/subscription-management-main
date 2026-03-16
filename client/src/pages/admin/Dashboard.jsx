import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { format } from 'date-fns';
import { downloadAdminReport } from '../../utils/downloadHelper';
import { FiUsers, FiActivity, FiBox, FiCpu, FiTrendingUp, FiArrowUpRight, FiDownload, FiCommand, FiTag } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
    <div className="glass-card p-8 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity`}>
        <Icon className={`text-7xl ${color}`} />
      </div>
      <div className="relative z-10 text-left">
        <p className="text-[10px] font-black tracking-[3px] uppercase text-gray-500 mb-4">{title}</p>
        <div className="flex items-baseline space-x-3">
          <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase">{value}</h3>
          {trend && <span className="text-green-500 text-xs font-bold flex items-center"><FiArrowUpRight className="mr-1" /> {trend}</span>}
        </div>
        <p className="text-gray-500 text-xs font-light mt-2 tracking-wide uppercase">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white">
            ADMIN <span className="text-red-600">COMMAND</span>
          </h1>
          <p className="text-gray-500 font-light mt-1 text-sm">Real-time platform performance and member metrics</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              const reportData = stats.recentSubscriptions.map(sub => ({
                Member: sub.user?.name,
                Email: sub.user?.email,
                Plan: sub.plan?.name,
                Price: `₹${sub.pricePaid}`,
                Status: sub.status,
                Joined: format(new Date(sub.createdAt), 'MMM dd, yyyy')
              }));
              downloadAdminReport(reportData, 'Platform_Activity_Report.pdf');
            }}
            className="btn-secondary py-3 px-6 flex items-center space-x-3"
          >
            <FiDownload />
            <span className="text-[10px] tracking-widest">DOWNLOAD PDF LOGS</span>
          </button>
        </div>
      </div>

      {/* Quick Navigation - The Command Center */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/plans" className="glass-card p-6 flex items-center justify-between group hover:border-red-600/30 transition-all">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
              <FiBox className="text-xl" />
            </div>
            <div>
              <p className="text-white font-black italic tracking-tighter uppercase">Plan Architect</p>
              <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Configure Tiers</p>
            </div>
          </div>
          <FiArrowUpRight className="text-gray-700 group-hover:text-red-600 transition-colors" />
        </Link>
        <Link to="/admin/users" className="glass-card p-6 flex items-center justify-between group hover:border-blue-600/30 transition-all">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <FiUsers className="text-xl" />
            </div>
            <div>
              <p className="text-white font-black italic tracking-tighter uppercase">User Registry</p>
              <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Manage Citizens</p>
            </div>
          </div>
          <FiArrowUpRight className="text-gray-700 group-hover:text-blue-500 transition-colors" />
        </Link>
        <Link to="/admin/videos" className="glass-card p-6 flex items-center justify-between group hover:border-green-600/30 transition-all">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-green-600/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <FiActivity className="text-xl" />
            </div>
            <div>
              <p className="text-white font-black italic tracking-tighter uppercase">Media Library</p>
              <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Catalog Control</p>
            </div>
          </div>
          <FiArrowUpRight className="text-gray-700 group-hover:text-green-600 transition-colors" />
        </Link>
        <Link to="/admin/coupons" className="glass-card p-6 flex items-center justify-between group hover:border-yellow-600/30 transition-all">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-600/10 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
              <FiTag className="text-xl" />
            </div>
            <div>
              <p className="text-white font-black italic tracking-tighter uppercase">Voucher Vault</p>
              <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Promo Campaigns</p>
            </div>
          </div>
          <FiArrowUpRight className="text-gray-700 group-hover:text-yellow-500 transition-colors" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FiUsers}
          title="Total Members"
          value={stats?.users.total}
          subtitle={`${stats?.users.regular} verified users`}
          trend="+12%"
          color="text-red-600"
        />
        <StatCard
          icon={FiActivity}
          title="Active Subs"
          value={stats?.subscriptions.active}
          subtitle={`${stats?.subscriptions.total} accumulated`}
          trend="+5%"
          color="text-blue-500"
        />
        <StatCard
          icon={FiCommand}
          title="Revenue"
          value={`₹${stats?.revenue.total.toFixed(0)}`}
          subtitle={`₹${stats?.revenue.monthly.toFixed(0)} this month`}
          trend="+24%"
          color="text-green-500"
        />
        <StatCard
          icon={FiTrendingUp}
          title="Market Cap"
          value="TOP 1%"
          subtitle="Tier-1 Performance"
          color="text-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
            <h2 className="text-xs font-black tracking-[4px] uppercase text-gray-400">Recent Onboarding</h2>
            <FiTrendingUp className="text-red-600" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Member</th>
                  <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Plan</th>
                  <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.recentSubscriptions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <p className="text-white font-bold">{sub.user?.name}</p>
                      <p className="text-[10px] text-gray-500 font-light italic">{sub.user?.email}</p>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black tracking-widest text-red-600 border border-red-600/20 uppercase">
                        {sub.plan?.name}
                      </span>
                    </td>
                    <td className="p-6 text-right text-xs text-gray-500 font-light uppercase">
                      {format(new Date(sub.createdAt), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="glass-card flex flex-col">
          <div className="p-8 border-b border-white/5 bg-white/5">
            <h2 className="text-xs font-black tracking-[4px] uppercase text-gray-400">Tier Distribution</h2>
          </div>
          <div className="p-8 space-y-8 flex-grow">
            {stats?.plansDistribution.map((plan) => (
              <div key={plan.planName} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white font-bold tracking-tighter uppercase italic">{plan.planName}</p>
                    <p className="text-[10px] text-gray-500 font-bold tracking-widest">{plan.count} ACTIVE</p>
                  </div>
                  <p className="text-white font-black italic text-lg">₹{plan.revenue.toFixed(0)}</p>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all duration-1000"
                    style={{ width: `${(plan.count / (stats?.subscriptions.total || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="text-center py-10 opacity-30">
        <p className="text-[10px] font-black tracking-[8px] uppercase text-gray-500">StreamHub Management Alpha 1.0.4</p>
      </div>
    </div>
  );
};

export default AdminDashboard;

