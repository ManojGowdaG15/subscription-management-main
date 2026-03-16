import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import ContentFilter from '../components/ContentFilter';
import ContinueWatching from '../components/ContinueWatching';
import TrendingSection from '../components/TrendingSection';
import VideoSkeleton from '../components/VideoSkeleton';
import VideoRow from '../components/VideoRow';
import { useAuth } from '../context/AuthContext';
import { videoAPI } from '../services/api';
import { FiSearch, FiFilter, FiZap, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Browse = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const searchQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory, searchQuery]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined
      };
      const response = await videoAPI.getAll(params);
      setVideos(response.data.videos || []);
    } catch (error) {
      toast.error('Sync failed with library');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) setSearchParams({ q: searchInput.trim() });
    else setSearchParams({});
  };

  // Group videos by category/tier for row display
  const trendingVideos = useMemo(() => videos.filter(v => v.isTrending), [videos]);
  const newReleases = useMemo(() => videos.filter(v => v.isPremiere), [videos]); // Updated to isPremiere
  const proVideos = useMemo(() => videos.filter(v => v.accessTier === 'pro'), [videos]);
  const premiumVideos = useMemo(() => videos.filter(v => v.accessTier === 'premium'), [videos]);
  const basicVideos = useMemo(() => videos.filter(v => v.accessTier === 'basic'), [videos]);

  return (
    <div className="pb-24 space-y-16">
      {/* Immersive Search / Filter Header */}
      <section className="relative pt-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-8 text-white">
            EXPLORE <span className="text-red-600">UNIVERSE</span>
          </h1>
          <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-red-600/20 blur-2xl group-focus-within:bg-red-600/40 transition-all rounded-full -z-10"></div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Masterpiece, Genre, or Cast..."
              className="input-premium py-5 pl-8 pr-16 text-lg rounded-full"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-600/40">
              <FiSearch className="text-xl" />
            </button>
          </form>
        </div>
      </section>

      {/* Hero Highlight - Only on Default View */}
      {!searchQuery && selectedCategory === 'all' && (
        <section className="relative group container mx-auto px-4">
          <div className="relative h-[70vh] rounded-3xl overflow-hidden glass-card border-none shadow-[0_0_80px_rgba(0,0,0,0.5)]">
            <img
              src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
              alt="Cinema"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10 md:p-20">
              <div className="max-w-2xl space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-600 rounded text-[10px] font-black tracking-widest uppercase text-white mb-4">
                  <FiZap className="animate-pulse" />
                  <span>Trending Now</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase text-white leading-none cursor-pointer hover:text-red-500 transition-colors" onClick={() => videos.length > 0 && (window.location.href = `/watch/${videos[0]._id}`)}>
                  THE LAST <span className="text-red-600">ECHO</span>
                </h2>
                <p className="text-gray-300 text-lg font-light max-w-lg">In a world silenced by technology, one voice remains. Experience the cinematic event of the year.</p>
                <div className="flex space-x-6 pt-4">
                  <button
                    onClick={() => videos.length > 0 && (window.location.href = `/watch/${videos[0]._id}`)}
                    className="btn-premium flex items-center space-x-2"
                  >
                    <span>PLAY NOW</span>
                    <FiChevronRight />
                  </button>
                  <button className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-full font-black text-xs tracking-widest transition-all">MY LIST</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 space-y-24">
        {/* Continue Progress */}
        {user && !searchQuery && (
          <ContinueWatching />
        )}

        {/* Dynamic Rows - Netflix Style */}
        {!searchQuery ? (
          <>
            <VideoRow title="Trending Intelligence" videos={trendingVideos} loading={loading} />
            <VideoRow title="Ultra HDR - Pro Exclusive" videos={proVideos} loading={loading} />
            <VideoRow title="Fresh Premieres" videos={newReleases} loading={loading} />
            <VideoRow title="Premium Cinematic Assets" videos={premiumVideos} loading={loading} />
            <VideoRow title="Base Library" videos={basicVideos} loading={loading} />
          </>
        ) : (
          <div className="space-y-10">
            <h2 className="text-xs font-black tracking-[4px] uppercase text-gray-500">SEARCH RESULTS FOR "{searchQuery}"</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {videos.length > 0 ? (
                videos.map(video => <VideoCard key={video._id} video={video} />)
              ) : (
                <div className="col-span-full py-32 text-center glass-card border-none">
                  <FiZap className="text-5xl text-gray-700 mx-auto mb-6" />
                  <p className="text-gray-500 font-light italic tracking-widest uppercase text-sm">Library void: No assets found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
