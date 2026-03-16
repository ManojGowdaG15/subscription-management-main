const VideoSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
      <div className="mt-2 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="flex space-x-4">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoSkeleton;