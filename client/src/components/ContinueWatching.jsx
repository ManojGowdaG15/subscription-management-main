import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoCard from './VideoCard';
import { videoAPI } from '../services/api';
import { FiClock } from 'react-icons/fi';

const ContinueWatching = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContinueWatching();
  }, []);

  const fetchContinueWatching = async () => {
    try {
      // Try to get continue watching from the API
      // If endpoint doesn't exist, fallback to regular history
      const response = await videoAPI.getWatchHistory();
      // Filter out completed videos and those with no progress
      const inProgress = response.data.history.filter(
        item => !item.completed && item.progress > 0 && item.video
      );
      setHistory(inProgress.slice(0, 5));
    } catch (error) {
      console.error('Failed to load watch history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || history.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center space-x-2">
        <FiClock className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold">Continue Watching</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {history.map(item => (
          <VideoCard 
            key={item._id} 
            video={item.video} 
            progress={item.progress}
          />
        ))}
      </div>
    </section>
  );
};

export default ContinueWatching;