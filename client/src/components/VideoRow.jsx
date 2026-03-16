import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import VideoCard from './VideoCard';

const VideoRow = ({ title, videos, loading }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (!loading && (!videos || videos.length === 0)) return null;

    return (
        <div className="space-y-6 group/row relative">
            <div className="flex items-center justify-between px-4 md:px-0">
                <h3 className="text-xs font-black tracking-[4px] uppercase text-gray-500 flex items-center space-x-3">
                    <span className="w-8 h-[1px] bg-red-600/50"></span>
                    <span>{title}</span>
                </h3>
            </div>

            <div className="relative">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 bottom-0 z-40 bg-black/60 hover:bg-black/80 text-white w-12 hidden md:flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
                >
                    <FiChevronLeft size={32} />
                </button>

                <div
                    ref={rowRef}
                    className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-0 pb-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="min-w-[280px] md:min-w-[320px] aspect-video animate-pulse bg-white/5 rounded-2xl"></div>
                        ))
                    ) : (
                        videos.map(video => (
                            <div key={video._id} className="min-w-[280px] md:min-w-[320px] snap-start">
                                <VideoCard video={video} />
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-0 z-40 bg-black/60 hover:bg-black/80 text-white w-12 hidden md:flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
                >
                    <FiChevronRight size={32} />
                </button>
            </div>
        </div>
    );
};

export default VideoRow;
