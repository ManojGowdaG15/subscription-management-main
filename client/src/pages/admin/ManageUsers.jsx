import { useState, useEffect } from 'react';
import { FiSearch, FiShield, FiTrash2, FiUsers, FiMail, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { format } from 'date-fns';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(currentPage, 10, searchTerm);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDeactivateSubscription = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user subscription?')) {
      try {
        await adminAPI.deactivateUserSubscription(userId);
        toast.success('Subscription deactivated');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to deactivate subscription');
      }
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Header Orchestration */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center space-x-2 text-blue-500 mb-2">
            <FiUsers />
            <span className="text-[10px] font-black tracking-[4px] uppercase italic">Identity Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
            USER <span className="text-blue-500">REGISTRY</span>
          </h1>
          <p className="text-gray-500 font-light text-sm mt-2 max-w-md uppercase tracking-widest">
            Monitor ecosystem citizens and manage subscription status.
          </p>
        </div>

        <div className="glass-card min-w-[300px] border-white/5 flex items-center px-4 relative group">
          <FiSearch className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search Identity..."
            value={searchTerm}
            onChange={handleSearch}
            className="bg-transparent border-none outline-none px-4 py-4 text-white text-xs font-black tracking-widest uppercase placeholder:text-gray-700 w-full"
          />
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-focus-within:w-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Users Logic Table */}
      <div className="glass-card border-white/5 overflow-hidden group">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="py-6 px-8 text-[10px] font-black tracking-[4px] uppercase text-gray-500">Identity / Status</th>
                <th className="py-6 px-8 text-[10px] font-black tracking-[4px] uppercase text-gray-500">Auth Tier</th>
                <th className="py-6 px-8 text-[10px] font-black tracking-[4px] uppercase text-gray-500">Deployment Plan</th>
                <th className="py-6 px-8 text-[10px] font-black tracking-[4px] uppercase text-gray-500 text-center">Protocol Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-white/[0.01] transition-colors group/row">
                  <td className="py-6 px-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center font-black text-xs text-blue-500 group-hover/row:scale-110 transition-transform">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-black italic tracking-tighter uppercase text-lg leading-tight">{user.name}</p>
                        <div className="flex items-center space-x-2 text-gray-600 mt-1">
                          <FiMail className="text-[10px]" />
                          <span className="text-[10px] font-black tracking-widest uppercase">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[9px] font-black tracking-[3px] uppercase italic ${user.role === 'admin' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'
                      }`}>
                      {user.role === 'admin' && <FiShield />}
                      <span>{user.role}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    {user.currentSubscription ? (
                      <div className="space-y-1">
                        <p className="text-white font-black text-xs tracking-[2px] uppercase">{user.currentSubscription.plan?.name}</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                          <span className="text-[9px] font-black tracking-widest uppercase text-gray-600 italic">Verified Node</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-700 text-[10px] font-black tracking-widest uppercase italic">Unauthorized Access</span>
                    )}
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex justify-center">
                      {user.currentSubscription ? (
                        <button
                          onClick={() => handleDeactivateSubscription(user._id)}
                          className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-red-600/20 hover:border-red-600/40 text-gray-600 hover:text-red-500 transition-all"
                          title="Suspend Protocol"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-full border border-white/[0.02] flex items-center justify-center text-gray-800">
                          <FiXCircle />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-gray-700 font-black tracking-[5px] uppercase italic">Identity Query: Zero Matches Found</p>
          </div>
        )}
      </div>

      {/* Pagination Infrastructure */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-white disabled:opacity-20 hover:bg-white/10 transition-all"
          >
            <FiChevronLeft className="text-xl" />
          </button>

          <div className="flex items-center space-x-3">
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${currentPage === page
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                    : 'glass-card border-white/5 text-gray-500 hover:text-white'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
            disabled={currentPage === pagination.pages}
            className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-white disabled:opacity-20 hover:bg-white/10 transition-all"
          >
            <FiChevronRight className="text-xl" />
          </button>
        </div>
      )}

      {/* Analytic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card border-white/5 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><FiUsers className="text-4xl" /></div>
          <p className="text-[10px] font-black text-gray-500 tracking-[3px] uppercase mb-4 italic">Registry Load</p>
          <div className="flex items-baseline space-x-3">
            <p className="text-4xl font-black italic tracking-tighter text-white uppercase">{users.length}</p>
            <p className="text-xs text-gray-600 font-black tracking-widest uppercase">/ Segment</p>
          </div>
        </div>
        <div className="glass-card border-white/5 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><FiCalendar className="text-4xl" /></div>
          <p className="text-[10px] font-black text-gray-500 tracking-[3px] uppercase mb-4 italic">Logical Page</p>
          <div className="flex items-baseline space-x-3">
            <p className="text-4xl font-black italic tracking-tighter text-white uppercase">{currentPage}</p>
            <p className="text-xs text-gray-600 font-black tracking-widest uppercase">/ {pagination?.pages}</p>
          </div>
        </div>
        <div className="glass-card border-white/5 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><FiActivity className="text-4xl" /></div>
          <p className="text-[10px] font-black text-gray-500 tracking-[3px] uppercase mb-4 italic">Global Volume</p>
          <div className="flex items-baseline space-x-3">
            <p className="text-4xl font-black italic tracking-tighter text-blue-500 uppercase">{pagination?.total}</p>
            <p className="text-xs text-gray-600 font-black tracking-widest uppercase italic">Records</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Import helper
const FiXCircle = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
);
const FiActivity = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

export default ManageUsers;

