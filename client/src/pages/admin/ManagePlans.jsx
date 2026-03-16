import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiZap, FiCheck, FiX, FiLayers } from 'react-icons/fi';
import { planAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: 'monthly',
    features: []
  });
  const [featureInput, setFeatureInput] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await planAPI.update(editingId, formData);
        toast.success('Plan updated successfully');
      } else {
        await planAPI.create(formData);
        toast.success('Plan created successfully');
      }
      setFormData({ name: '', description: '', price: '', duration: 'monthly', features: [] });
      setShowForm(false);
      setEditingId(null);
      fetchPlans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save plan');
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      features: plan.features || []
    });
    setEditingId(plan._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await planAPI.delete(id);
        toast.success('Plan deleted successfully');
        fetchPlans();
      } catch (error) {
        toast.error('Failed to delete plan');
      }
    }
  };

  if (loading) {
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
          <div className="flex items-center space-x-2 text-red-600 mb-2">
            <FiLayers />
            <span className="text-[10px] font-black tracking-[4px] uppercase italic">Product Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
            PLAN <span className="text-red-600">ARCHITECT</span>
          </h1>
          <p className="text-gray-500 font-light text-sm mt-2 max-w-md uppercase tracking-widest">
            Configure global subscription archetypes and distribution tiers.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ name: '', description: '', price: '', duration: 'monthly', features: [] });
            }}
            className="btn-premium px-8 py-4 group"
          >
            <div className="flex items-center space-x-3">
              <span className="font-black text-[10px] tracking-[3px]">INITIALIZE NEW PLAN</span>
              <FiPlus className="text-lg group-hover:rotate-180 transition-transform duration-500" />
            </div>
          </button>
        )}
      </div>

      {/* Form Infrastructure */}
      {showForm && (
        <div className="glass-card border-white/5 p-8 md:p-12 animate-fade-in relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-[2px] h-full bg-red-600"></div>

          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">
              {editingId ? 'RECONFIGURE' : 'CREATE'} // <span className="text-red-600">PARAMETER SET</span>
            </h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition-colors">
              <FiX className="text-2xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 tracking-[3px] uppercase">Plan Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-red-600/50 transition-all outline-none italic font-medium"
                  placeholder="e.g. ULTIMATE"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 tracking-[3px] uppercase">Price (USD)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-red-600/50 transition-all outline-none font-black text-xl"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 tracking-[3px] uppercase">Cycle</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-red-600/50 transition-all outline-none appearance-none uppercase font-black text-[10px] tracking-widest cursor-pointer"
                >
                  <option value="monthly" className="bg-zinc-900 uppercase">Monthly</option>
                  <option value="yearly" className="bg-zinc-900 uppercase">Yearly</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 tracking-[3px] uppercase">Proposition Pitch</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-red-600/50 transition-all outline-none min-h-[100px] font-light"
                placeholder="Describe the cinematic value..."
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 tracking-[3px] uppercase">Feature Protocol Matrix</label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Inject new feature..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-red-600/50 transition-all outline-none italic"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-6 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] tracking-widest uppercase hover:bg-white/10"
                >
                  INJECT
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl group/item">
                    <div className="flex items-center space-x-3">
                      <FiCheck className="text-red-600" />
                      <span className="text-sm font-medium tracking-wide text-gray-300 italic">{feature}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button type="submit" className="btn-premium flex-1 py-5 font-black tracking-[4px]">
                {editingId ? 'SYNC CHANGES' : 'DEPLOY PLAN'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plans Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map(plan => (
          <div key={plan._id} className="glass-card p-8 group relative overflow-hidden flex flex-col items-stretch">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-red-600">
                  <FiZap />
                  <span className="text-[9px] font-black tracking-[3px] uppercase">Active Tier</span>
                </div>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">{plan.name}</h3>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEdit(plan)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <FiEdit2 className="text-gray-400 group-hover:text-white" />
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-red-600/20 hover:border-red-600/40 transition-all"
                >
                  <FiTrash2 className="text-gray-400 group-hover:text-red-500" />
                </button>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline">
                <span className="text-5xl font-black tracking-tighter text-white">₹{plan.price}</span>
                <span className="text-gray-500 ml-2 text-xs font-black tracking-widest uppercase italic">/{plan.duration}</span>
              </div>
              <p className="text-gray-600 mt-4 text-xs font-light leading-relaxed tracking-wider uppercase">{plan.description}</p>
            </div>

            <div className="space-y-3 flex-grow mb-10">
              {plan.features?.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-gray-400">
                  <FiCheck className="text-red-600 text-xs shrink-0" />
                  <span className="text-[11px] font-medium tracking-wide uppercase">{feature}</span>
                </div>
              ))}
            </div>

            <div className={`mt-auto pt-6 border-t border-white/5 flex items-center justify-between`}>
              <span className={`text-[10px] font-black tracking-[4px] uppercase italic ${plan.isActive ? 'text-green-500' : 'text-red-500'}`}>
                {plan.isActive ? 'Deployment: Healthy' : 'Deployment: Suspended'}
              </span>
              <div className={`w-3 h-3 rounded-full ${plan.isActive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePlans;

