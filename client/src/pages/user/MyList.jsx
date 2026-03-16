import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiClock, FiEye } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { listAPI, videoAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import VideoCard from '../../components/VideoCard';

const MyList = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingList, setCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await listAPI.getLists();
      setLists(response.data.lists || []);
      
      if (response.data.lists && response.data.lists.length > 0) {
        setSelectedList(response.data.lists[0]);
        fetchVideosForList(response.data.lists[0]._id);
      }
    } catch (error) {
      console.error('Failed to load lists:', error);
      toast.error('Failed to load your lists');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideosForList = async (listId) => {
    try {
      const response = await listAPI.getList(listId);
      setVideos(response.data.list.videos || []);
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  };

  const handleListSelect = (list) => {
    setSelectedList(list);
    fetchVideosForList(list._id);
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    setCreatingList(true);
    try {
      const response = await listAPI.createList({ 
        name: newListName, 
        type: 'custom' 
      });
      toast.success('List created successfully');
      setNewListName('');
      fetchLists();
    } catch (error) {
      toast.error('Failed to create list');
    } finally {
      setCreatingList(false);
    }
  };

  const handleRemoveFromList = async (videoId) => {
    if (!selectedList) return;

    try {
      await listAPI.removeFromList(selectedList._id, videoId);
      toast.success('Removed from list');
      setVideos(videos.filter(v => v._id !== videoId));
    } catch (error) {
      toast.error('Failed to remove video');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;

    try {
      await listAPI.deleteList(listId);
      toast.success('List deleted');
      fetchLists();
    } catch (error) {
      toast.error('Failed to delete list');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My List</h1>
        
        <form onSubmit={handleCreateList} className="flex space-x-2">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name..."
            className="input max-w-xs"
          />
          <button
            type="submit"
            disabled={creatingList || !newListName.trim()}
            className="btn-primary"
          >
            {creatingList ? 'Creating...' : 'Create List'}
          </button>
        </form>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FiHeart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">Your list is empty</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start adding videos to your list to watch them later
          </p>
          <Link to="/browse" className="btn-primary">
            Browse Videos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-2">
            {lists.map(list => (
              <div
                key={list._id}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  selectedList?._id === list._id
                    ? 'bg-primary-100 dark:bg-primary-900 border-2 border-primary-500'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleListSelect(list)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{list.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {list.videos?.length || 0} videos
                    </p>
                  </div>
                  {list.type !== 'watchlist' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list._id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            {selectedList && (
              <>
                <h2 className="text-2xl font-bold mb-4">{selectedList.name}</h2>
                
                {videos.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No videos in this list yet
                    </p>
                    <Link to="/browse" className="btn-primary">
                      Browse Videos
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map(video => (
                      <div key={video._id} className="relative group">
                        <VideoCard video={video} />
                        <button
                          onClick={() => handleRemoveFromList(video._id)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600 z-10"
                          title="Remove from list"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyList;
