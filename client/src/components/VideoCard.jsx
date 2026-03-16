import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiPlay, FiClock, FiEye, FiLock, FiUnlock, FiPlus, FiCheck, FiInfo } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useVideoAccess } from '../hooks/useVideoAccess';
import { listAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const VideoCard = ({ video, progress = 0 }) => {
  const { user } = useAuth();
  const { canAccessVideo, getBadgeColor, getTierLabel } = useVideoAccess();
  const [isInList, setIsInList] = useState(false);
  const [addingToList, setAddingToList] = useState(false);

  const hasAccess = canAccessVideo(video.accessTier);

  useEffect(() => {
    if (user) checkIfInList();
  }, [video._id, user]);

  const checkIfInList = async () => {
    try {
      const response = await listAPI.checkVideo(video._id);
      setIsInList(response.data.inList);
    } catch (error) { }
  };

  const handleAddToList = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Identity required for list synchronization');
      return;
    }
    setAddingToList(true);
    try {
      if (isInList) {
        const lists = await listAPI.getLists();
        const watchlist = lists.data.lists.find(l => l.type === 'watchlist');
        if (watchlist) {
          await listAPI.removeFromList(watchlist._id, video._id);
          setIsInList(false);
          toast.success('Asset removed from library');
        }
      } else {
        const lists = await listAPI.getLists();
        let watchlist = lists.data.lists.find(l => l.type === 'watchlist');
        if (!watchlist) {
          const newList = await listAPI.createList({ name: 'My List', type: 'watchlist' });
          watchlist = newList.data.list;
        }
        await listAPI.addToList(watchlist._id, video._id);
        setIsInList(true);
        toast.success('Asset secured in library');
      }
    } catch (error) {
      toast.error('Transmission error');
    } finally {
      setAddingToList(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group relative flex flex-col h-full bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-red-600/30 transition-all duration-500 shadow-2xl">
      <Link to={hasAccess ? `/watch/${video._id}` : '/plans'} className="relative aspect-video overflow-hidden">
        {/* Thumbnail with Ken Burns effect on hover */}
        <img
          src={video.thumbnail || 'https://via.placeholder.com/400x225'}
          alt=""
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.6)]">
            <FiPlay className="text-white text-xl ml-1" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className={`px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex items-center space-x-1 z-10`}>
            {hasAccess ? <FiUnlock className="text-[10px] text-green-500" /> : <FiLock className="text-[10px] text-red-600" />}
            <span className="text-[9px] font-black tracking-widest uppercase text-white">{video.accessTier}</span>
          </div>
          {video.isPremiere && (
            <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase shadow-[0_0_10px_rgba(229,9,20,0.5)]">Premiere</span>
          )}
          {video.isExclusive && (
            <span className="bg-white text-black text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Exclusive</span>
          )}
          {video.accessTier === 'pro' && (
            <span className="bg-yellow-600 text-black text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase shadow-[0_0_10px_rgba(202,138,4,0.5)]">4K HDR</span>
          )}
        </div>

        {/* Runtime */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white tracking-widest">
          {formatDuration(video.duration)}
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-red-600 shadow-[0_0_10px_rgba(229,9,20,1)]"
              style={{ width: `${(progress / video.duration) * 100}%` }}
            />
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow relative">
        {/* Action buttons on card body too */}
        <div className="absolute -top-6 right-5 flex space-x-2 z-20">
          <button
            onClick={handleAddToList}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all ${isInList ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-black/60 text-white hover:bg-red-600/80 transition-colors'
              }`}
          >
            {addingToList ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : isInList ? <FiCheck /> : <FiPlus />}
          </button>
        </div>

        <Link to={hasAccess ? `/watch/${video._id}` : '/plans'} className="space-y-2 flex-grow">
          <h3 className="text-white font-black italic tracking-tighter uppercase text-lg group-hover:text-red-500 transition-colors line-clamp-1">{video.title}</h3>
          <p className="text-[11px] text-gray-500 font-light leading-relaxed line-clamp-2 uppercase tracking-wide">
            {video.description}
          </p>
        </Link>

        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <span className="flex items-center space-x-1">
              <FiEye className="text-red-600" />
              <span>{(video.views || 0)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <FiClock />
              <span>{formatDistanceToNow(new Date(video.createdAt || Date.now()))}</span>
            </span>
          </div>
          <FiInfo className="text-gray-700 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
