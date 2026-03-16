import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoCard from './VideoCard';
import { videoAPI } from '../services/api';
import { FiTrendingUp } from 'react-icons/fi';

const TrendingSection = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const response = await videoAPI.getTrending();
      setVideos(response.data.videos.slice(0, 5));
    } catch (error) {
      console.error('Failed to load trending videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || videos.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center space-x-2">
        <FiTrendingUp className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold">Trending Now</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {videos.map(video => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;