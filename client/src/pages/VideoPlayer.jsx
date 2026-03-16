import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiMinimize,
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiRotateCcw,
  FiRotateCw,
  FiCast,
  FiZap,
  FiLock,
  FiUnlock
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useVideoAccess } from '../hooks/useVideoAccess';
import { videoAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [error, setError] = useState(null);
  const { getAvailableQualities } = useVideoAccess();
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    fetchVideo();
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await videoAPI.getById(id);
      setVideo(response.data.video);
      setDuration(response.data.video.duration);
    } catch (error) {
      if (error.response?.status === 403) {
        setError(error.response.data);
      } else {
        toast.error('Library sync error');
        navigate('/browse');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      setIsMuted(v === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    if (videoRef.current) videoRef.current.currentTime = t;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 4000);
  };

  const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading || !video) {
    if (error) return null; // already handled below
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center p-4">
        <div className="max-w-xl w-full text-center space-y-10 animate-fade-in px-8">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600/20 blur-[80px] animate-pulse"></div>
            <div className="w-32 h-32 rounded-3xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mx-auto relative z-10 shadow-[0_0_50px_rgba(229,9,20,0.1)]">
              <FiLock className="text-5xl text-red-600" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-black tracking-[6px] uppercase text-red-600">Transmission Blocked</h2>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
              TIER <span className="text-red-600">INSUFFICIENT</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] max-w-sm mx-auto leading-relaxed">
              This asset is encrypted for {error.requiredTier} level citizens. Your current status: {error.currentTier || 'Standard'}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/browse')}
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-black text-[10px] tracking-widest uppercase transition-all"
            >
              Return to Base
            </button>
            <button
              onClick={() => navigate('/plans')}
              className="btn-premium py-4 px-10 flex items-center justify-center space-x-2"
            >
              <FiZap />
              <span>UPGRADE PROTOCOL</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className="relative bg-black h-screen w-full overflow-hidden cursor-none"
      onMouseMove={() => { handleMouseMove(); playerRef.current.style.cursor = 'default'; }}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      {/* Cinematic Filter */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnail}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); setShowControls(true); }}
      />

      {/* Header Controls */}
      <div className={`absolute top-0 left-0 right-0 p-10 z-20 flex justify-between items-start transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all">
            <FiArrowLeft className="text-white text-xl" />
          </button>
          <div>
            <h2 className="text-white font-black italic tracking-tighter uppercase text-2xl leading-none">{video.title}</h2>
            <div className="flex items-center space-x-3 mt-2">
              <p className="text-red-600 text-[10px] font-black tracking-[4px] uppercase">CYBER-STREAM ACTIVE</p>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <p className="text-white/40 text-[10px] font-black tracking-[4px] uppercase">{selectedQuality}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"><FiCast /></button>
        </div>
      </div>

      {/* Center Play/Pause Indicator (Flashes on Toggle) */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${isPlaying ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
        {!isPlaying && <FiPlay className="text-white text-8xl opacity-20" />}
      </div>

      {/* Bottom Interface */}
      <div className={`absolute bottom-0 left-0 right-0 p-10 z-20 space-y-8 transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Timeline */}
        <div className="space-y-3">
          <div className="relative group/timeline">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 shadow-[0_0_15px_rgba(229,9,20,0.8)]" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
            </div>
            <input
              type="range" min="0" max={duration || 100} value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover/timeline:scale-100 transition-transform pointer-events-none" style={{ left: `calc(${(currentTime / duration) * 100}% - 8px)` }}></div>
          </div>
          <div className="flex justify-between items-center text-[11px] font-black text-white/40 tracking-[2px] uppercase">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-8">
              <button onClick={() => skip(-10)} className="text-white/60 hover:text-white transition-colors"><FiRotateCcw className="text-xl" /></button>
              <button onClick={togglePlay} className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                {isPlaying ? <FiPause className="text-black text-2xl" /> : <FiPlay className="text-black text-2xl ml-1" />}
              </button>
              <button onClick={() => skip(10)} className="text-white/60 hover:text-white transition-colors"><FiRotateCw className="text-xl" /></button>
            </div>

            <div className="flex items-center space-x-4 group/volume">
              <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                {isMuted ? <FiVolumeX className="text-xl" /> : <FiVolume2 className="text-xl" />}
              </button>
              <div className="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-300">
                <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-20 accent-red-600 h-1" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            {/* Resolution Selector */}
            <div className="flex items-center space-x-3 pr-4 border-r border-white/10">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Master</span>
              <div className="flex space-x-4">
                {getAvailableQualities().map(q => (
                  <button
                    key={q}
                    onClick={() => setSelectedQuality(q)}
                    className={`text-[10px] font-black tracking-widest transition-all ${selectedQuality === q ? 'text-red-600 underline underline-offset-4' : 'text-white/40 hover:text-white'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {[0.5, 1, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => { setPlaybackSpeed(speed); videoRef.current.playbackRate = speed; }}
                  className={`text-[10px] font-black tracking-widest uppercase transition-colors ${playbackSpeed === speed ? 'text-red-600' : 'text-white/40 hover:text-white'}`}
                >
                  {speed}X
                </button>
              ))}
            </div>
            <button onClick={toggleFullscreen} className="text-white/60 hover:text-white transition-colors">
              {isFullscreen ? <FiMinimize className="text-xl" /> : <FiMaximize className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
        <FiZap className="text-[40vh] text-white" />
      </div>
    </div>
  );
};

export default VideoPlayer;
