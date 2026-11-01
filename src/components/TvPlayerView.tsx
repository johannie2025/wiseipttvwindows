import React, { useState, useEffect, useRef } from 'react';
import { Channel, AspectRatio } from '../types/iptv';
import Hls from 'hls.js';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Volume2,
  VolumeX,
  List,
  Star,
  Tv,
  Clock,
  Sparkles,
  Sliders,
  Settings
} from 'lucide-react';

interface TvPlayerViewProps {
  channel: Channel;
  channels: Channel[];
  onClose: () => void;
  onSelectChannel: (channel: Channel) => void;
  onToggleFavorite: (channelId: string | number) => void;
}

export const TvPlayerView: React.FC<TvPlayerViewProps> = ({
  channel,
  channels,
  onClose,
  onSelectChannel,
  onToggleFavorite
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [showOsd, setShowOsd] = useState(true);
  const [showChannelDrawer, setShowChannelDrawer] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const osdTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // OSD Auto-Hide Timer
  const triggerOsd = () => {
    setShowOsd(true);
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
    osdTimerRef.current = setTimeout(() => {
      setShowOsd(false);
    }, 4500);
  };

  useEffect(() => {
    triggerOsd();
    return () => {
      if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
    };
  }, [channel]);

  // Video Streaming Setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = channel.streamUrl;

    if (Hls.isSupported() && streamUrl.includes('.m3u8')) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setIsLoading(false);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else {
      video.src = streamUrl;
      video.load();
      video.play()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel]);

  // Zapping logic (Next / Previous channel)
  const currentIndex = channels.findIndex((c) => c.id === channel.id);

  const zapNext = () => {
    if (currentIndex >= 0 && currentIndex < channels.length - 1) {
      onSelectChannel(channels[currentIndex + 1]);
    } else if (channels.length > 0) {
      onSelectChannel(channels[0]);
    }
  };

  const zapPrevious = () => {
    if (currentIndex > 0) {
      onSelectChannel(channels[currentIndex - 1]);
    } else if (channels.length > 0) {
      onSelectChannel(channels[channels.length - 1]);
    }
  };

  // Keyboard navigation for TV Player
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      triggerOsd();

      if (e.key === 'Escape' || e.key === 'Backspace') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        zapNext();
      } else if (e.key === 'ArrowLeft') {
        zapPrevious();
      } else if (e.key === 'ArrowUp') {
        setVolume((v) => Math.min(1, v + 0.1));
      } else if (e.key === 'ArrowDown') {
        setVolume((v) => Math.max(0, v - 0.1));
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((m) => !m);
      } else if (e.key === 'l' || e.key === 'L') {
        setShowChannelDrawer((d) => !d);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, channels]);

  // Aspect ratio class
  const getAspectClass = () => {
    switch (aspectRatio) {
      case '4:3':
        return 'aspect-[4/3] max-h-full max-w-full object-contain';
      case 'zoom':
        return 'w-full h-full object-cover scale-110';
      case 'original':
        return 'max-h-full max-w-full object-contain';
      case '16:9':
      default:
        return 'w-full h-full object-contain';
    }
  };

  return (
    <div
      onMouseMove={triggerOsd}
      onClick={triggerOsd}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden cursor-none select-none hover:cursor-default"
    >
      {/* Video element */}
      <video
        ref={videoRef}
        playsInline
        muted={isMuted}
        className={getAspectClass()}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 pointer-events-none">
          <div className="w-14 h-14 border-4 border-[#1F7AE0] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-white font-bold text-sm">Chargement du flux TV...</p>
          <p className="text-xs text-[#8FA6CC] mt-1">{channel.name}</p>
        </div>
      )}

      {/* TOP OSD BAR matching activity_tv_player.xml */}
      <div
        className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-[#0C1E42]/95 via-[#0C1E42]/80 to-transparent transition-opacity duration-300 pointer-events-auto ${
          showOsd ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Back button & Channel Info */}
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="tv-focusable p-3 rounded-2xl bg-[#112042]/90 hover:bg-[#1F7AE0] text-white border border-[#22396B] transition-colors"
              title="Retour aux chaînes (Échap)"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                  {channel.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E5322D] text-white text-xs font-bold uppercase tracking-wider">
                  LIVE
                </span>
                <span className="px-2 py-0.5 rounded bg-[#0E1A33] text-[#4DA3FF] text-xs font-mono font-bold border border-[#22396B]">
                  {channel.resolution || '1080p 50fps FHD'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#4DA3FF] mt-1 font-medium">
                <span>{channel.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">{channel.currentProgram || 'Diffusion en Direct'}</span>
              </div>
            </div>
          </div>

          {/* Right OSD actions */}
          <div className="flex items-center gap-3">
            {/* Clock */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#112042]/80 border border-[#22396B] text-white font-mono text-sm">
              <Clock className="w-4 h-4 text-[#4DA3FF]" />
              <span>{currentTimeStr}</span>
            </div>

            {/* Favorite */}
            <button
              onClick={() => onToggleFavorite(channel.id)}
              className={`p-2.5 rounded-xl bg-[#112042]/80 border border-[#22396B] transition-colors ${
                channel.isFavorite ? 'text-[#F5B820]' : 'text-white hover:text-[#F5B820]'
              }`}
            >
              <Star className={`w-5 h-5 ${channel.isFavorite ? 'fill-[#F5B820]' : ''}`} />
            </button>

            {/* Aspect Ratio Switcher */}
            <button
              onClick={() => {
                const nextRatio: Record<AspectRatio, AspectRatio> = {
                  '16:9': '4:3',
                  '4:3': 'zoom',
                  'zoom': 'original',
                  'original': '16:9'
                };
                setAspectRatio(nextRatio[aspectRatio]);
              }}
              className="px-3 py-2 rounded-xl bg-[#112042]/80 hover:bg-[#1B2F5C] text-xs font-mono font-bold text-white border border-[#22396B] transition-colors"
              title="Changer le ratio d'aspect"
            >
              Format : {aspectRatio.toUpperCase()}
            </button>

            {/* Channel List Drawer Trigger */}
            <button
              onClick={() => setShowChannelDrawer(!showChannelDrawer)}
              className="p-2.5 rounded-xl bg-[#112042]/80 hover:bg-[#1F7AE0] text-white border border-[#22396B] transition-colors"
              title="Liste rapide des chaînes (L)"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Zapping Bottom Hint from activity_tv_player.xml */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <button
              onClick={zapPrevious}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#112042]/60 hover:bg-[#1F7AE0] transition-colors text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Chaîne précédente (◄)</span>
            </button>

            <button
              onClick={zapNext}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#112042]/60 hover:bg-[#1F7AE0] transition-colors text-white"
            >
              <span>Chaîne suivante (►)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            ◄ Chaîne précédente · ▲▼ Volume · Chaîne suivante ► · Échap : Sortir
          </div>
        </div>
      </div>

      {/* QUICK CHANNEL DRAWER (Overlay) */}
      {showChannelDrawer && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0A1530]/95 backdrop-blur-xl border-l border-[#22396B] p-4 flex flex-col z-50 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#22396B]/80 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-[#4DA3FF]" />
              Zapping Rapide
            </h3>
            <button
              onClick={() => setShowChannelDrawer(false)}
              className="text-xs text-[#8FA6CC] hover:text-white"
            >
              Fermer
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1">
            {channels.map((ch, idx) => {
              const isCurrent = ch.id === channel.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    onSelectChannel(ch);
                    setShowChannelDrawer(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                    isCurrent
                      ? 'bg-[#1F7AE0] text-white font-bold'
                      : 'hover:bg-[#112042] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] text-slate-400 w-5">
                      {idx + 1}
                    </span>
                    <span className="truncate">{ch.name}</span>
                  </div>
                  {ch.isFavorite && <Star className="w-3.5 h-3.5 fill-[#F5B820] text-[#F5B820]" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
