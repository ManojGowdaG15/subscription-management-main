import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiSave, FiX, FiFilm, FiActivity, FiLayers } from 'react-icons/fi';
import { videoAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    duration: 0,
    category: 'Movies',
    accessTier: 'basic',
    qualities: [
      { label: '360p', url: '', requiredTier: 'basic' },
      { label: '480p', url: '', requiredTier: 'basic' },
      { label: '720p', url: '', requiredTier: 'premium' },
      { label: '1080p', url: '', requiredTier: 'premium' },
      { label: '4K', url: '', requiredTier: 'pro' }
    ],
    tags: [],
    releaseYear: new Date().getFullYear(),
    isTrending: false,
    isPremiere: true
  });

  const categories = ['Movies', 'TV Shows', 'Documentaries', 'Kids', 'Sports'];
  const tiers = ['basic', 'premium', 'pro'];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await videoAPI.getAll({ admin: true });
      setVideos(response.data.videos || []);
    } catch (error) {
      toast.error('Failed to load library');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVideo) {
        await videoAPI.update(editingVideo._id, formData);
        toast.success('Studio assets updated');
      } else {
        await videoAPI.create(formData);
        toast.success('New content premiered');
      }
      fetchVideos();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Strike this content from the library?')) return;
    try {
      await videoAPI.delete(id);
      toast.success('Content purged');
      fetchVideos();
    } catch (error) {
      toast.error('Purge failed');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      videoUrl: '',
      duration: 0,
      category: 'Movies',
      accessTier: 'basic',
      qualities: [
        { label: '360p', url: '', requiredTier: 'basic' },
        { label: '480p', url: '', requiredTier: 'basic' },
        { label: '720p', url: '', requiredTier: 'premium' },
        { label: '1080p', url: '', requiredTier: 'premium' },
        { label: '4K', url: '', requiredTier: 'pro' }
      ],
      tags: [],
      releaseYear: new Date().getFullYear(),
      isTrending: false,
      isPremiere: true
    });
    setEditingVideo(null);
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      ...video,
      tags: video.tags || []
    });
    setShowModal(true);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white">
            CONTENT <span className="text-red-600">STUDIO</span>
          </h1>
          <p className="text-gray-500 font-light mt-1 text-sm tracking-widest uppercase">Global Library Management</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-premium flex items-center space-x-2"
        >
          <FiPlus />
          <span>UPLOAD CONTENT</span>
        </button>
      </div>

      {/* Library Grid/Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h2 className="text-[10px] font-black tracking-[4px] uppercase text-gray-400">Master Library ({videos.length} Assets)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="p-6 text-[10px] font-black tracking-widest text-gray-500 uppercase">Production</th>
                <th className="p-6 text-[10px] font-black tracking-widest text-gray-500 uppercase">Tier</th>
                <th className="p-6 text-[10px] font-black tracking-widest text-gray-500 uppercase">Runtime</th>
                <th className="p-6 text-[10px] font-black tracking-widest text-gray-500 uppercase">Stats</th>
                <th className="p-6 text-[10px] font-black tracking-widest text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {videos.length > 0 ? (
                videos.map(video => (
                  <tr key={video._id} className="hover:bg-white/5 group transition-colors">
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 group-hover:border-red-600/50 transition-colors">
                          <img
                            src={video.thumbnail || 'https://via.placeholder.com/100x60'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-white font-black italic uppercase tracking-tighter">{video.title}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{video.category} • {video.releaseYear}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${video.accessTier === 'pro' ? 'border-yellow-600/30 text-yellow-500 bg-yellow-600/5' :
                        video.accessTier === 'premium' ? 'border-purple-600/30 text-purple-500 bg-purple-600/5' :
                          'border-gray-600/30 text-gray-500'
                        }`}>
                        {video.accessTier}
                      </span>
                    </td>
                    <td className="p-6 text-xs text-gray-400 font-light">{video.duration ? formatDuration(video.duration) : 'N/A'}</td>
                    <td className="p-6 text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <FiEye className="text-[10px]" />
                        <span className="font-bold">{(video.views || 0).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-6 text-right space-x-4">
                      <button onClick={() => handleEdit(video)} className="text-gray-500 hover:text-white transition-colors"><FiEdit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(video._id)} className="text-gray-500 hover:text-red-500 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="p-20 text-center text-gray-600 italic font-light tracking-widest">NO ASSETS LOADED IN STUDIO</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overhaul */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="glass-card max-w-4xl w-full p-10 max-h-[90vh] overflow-y-auto border-red-600/20">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">{editingVideo ? 'UPDATE ASSET' : 'NEW PREMIERE'}</h2>
                <p className="text-gray-500 text-[10px] font-bold tracking-[3px] uppercase mt-1">Production Details & Metadata</p>
              </div>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"><FiX className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">Production Title</label>
                    <input
                      type="text" required value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-premium" placeholder="EPIC TITLE"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">Category</label>
                    <select
                      required value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-premium"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">Abstract / Synopsis</label>
                  <textarea
                    required rows="4" value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-premium" placeholder="Describe the masterpiece..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">Cover Asset (URL)</label>
                  <input
                    type="url" required value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="input-premium" placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">Master File (URL)</label>
                  <input
                    type="url" required value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="input-premium" placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">Runtime (Sec)</label>
                  <input
                    type="number" required value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className="input-premium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">Release Year</label>
                  <input
                    type="number" value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) || 2024 })}
                    className="input-premium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">Access Tier</label>
                  <select
                    required value={formData.accessTier}
                    onChange={(e) => setFormData({ ...formData, accessTier: e.target.value })}
                    className="input-premium"
                  >
                    {tiers.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black tracking-[4px] uppercase text-gray-400">Stream Optimization (Multi-Bitrate)</h3>
                  <FiLayers className="text-red-600" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.qualities.map((quality, index) => (
                    <div key={quality.label} className="flex flex-col space-y-2">
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{quality.label} Stream</span>
                      <input
                        type="url" value={quality.url}
                        onChange={(e) => {
                          const nq = [...formData.qualities]; nq[index].url = e.target.value;
                          setFormData({ ...formData, qualities: nq });
                        }}
                        className="input-premium py-2 text-xs" placeholder="URL..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-12 pt-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" checked={formData.isTrending} onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })} className="w-5 h-5 rounded border-white/10 bg-white/5 text-red-600 focus:ring-red-600/20" />
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">SET AS TRENDING</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" checked={formData.isPremiere} onChange={(e) => setFormData({ ...formData, isPremiere: e.target.checked })} className="w-5 h-5 rounded border-white/10 bg-white/5 text-red-600 focus:ring-red-600/20" />
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">NEW RELEASE TAG</span>
                </label>
              </div>

              <div className="flex justify-end space-x-6 pt-10 border-t border-white/5">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="text-xs font-black tracking-widest text-gray-500 hover:text-white uppercase">ABORT</button>
                <button type="submit" className="btn-premium py-4 px-12">
                  <span className="flex items-center space-x-2"><FiSave /> <span>{editingVideo ? 'SAVE PRODUCTION' : 'LAUNCH PREMIERE'}</span></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVideos;
