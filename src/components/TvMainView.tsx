import React, { useState, useEffect, useRef } from 'react';
import { Channel } from '../types/iptv';
import Hls from 'hls.js';
import { Play, Star, Tv, Radio, Maximize2, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface TvMainViewProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  onOpenFullscreenPlayer: (channel: Channel) => void;
  onToggleFavorite: (channelId: string | number) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
}

export const TvMainView: React.FC<TvMainViewProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  onOpenFullscreenPlayer,
  onToggleFavorite,
  activeCategory,
  onSelectCategory,
  categories
}) => {
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const hlsInstanceRef = useRef<Hls | null>(null);
  const [isPreviewMuted, setIsPreviewMuted] = useState(true);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  // Filter channels according to category
  const filteredChannels = channels.filter((ch) => {
    if (activeCategory === 'Tous') return true;
    if (activeCategory === 'Favoris') return ch.isFavorite;
    return ch.category === activeCategory || ch.groupTitle === activeCategory;
  });

  // Hls stream attachment for preview player
  useEffect(() => {
    const video = previewVideoRef.current;
    if (!video || !selectedChannel) return;

    setPreviewError(false);
    setIsPreviewLoading(true);

    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
      hlsInstanceRef.current = null;
    }

    const streamUrl = selectedChannel.streamUrl;

    if (Hls.isSupported() && streamUrl.includes('.m3u8')) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30
      });
      hlsInstanceRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsPreviewLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setIsPreviewLoading(false);
          setPreviewError(true);
        }
      });
    } else {
      video.src = streamUrl;
      video.load();
      video.play()
        .then(() => setIsPreviewLoading(false))
        .catch(() => {
          setIsPreviewLoading(false);
        });
    }

    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [selectedChannel]);

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
      {/* LEFT SECTION (68% width): Leanback Browse Fragment */}
      <div className="flex-[0.68] flex flex-col overflow-hidden border-r border-[#22396B]/50">
        {/* Category Horizontal Filter Bar */}
        <div className="px-6 py-3 border-b border-[#22396B]/50 bg-[#0A1530]/50 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`tv-focusable px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2F8CF0] to-[#1B5FC4] text-white shadow-md shadow-[#1F7AE0]/30 border border-white/30'
                    : 'bg-[#112042] text-[#8FA6CC] hover:text-white hover:bg-[#1B2F5C] border border-[#22396B]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Channels Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8FA6CC]">
              {activeCategory} · {filteredChannels.length} chaînes
            </span>
            <span className="text-xs text-[#4DA3FF] font-medium hidden sm:inline">
              Navigation Clavier : Touches Fléchées & Entrée
            </span>
          </div>

          {filteredChannels.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-[#0E1A33]/60 rounded-2xl border border-[#22396B]">
              <Tv className="w-12 h-12 text-[#22396B] mb-3" />
              <p className="text-base font-semibold text-white">Aucune chaîne dans cette catégorie</p>
              <p className="text-xs text-[#8FA6CC] mt-1 max-w-md">
                Ajoutez une playlist M3U ou sélectionnez une autre catégorie dans la barre supérieure.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredChannels.map((channel) => {
                const isSelected = selectedChannel?.id === channel.id;

                return (
                  <div
                    key={channel.id}
                    onClick={() => onSelectChannel(channel)}
                    onDoubleClick={() => onOpenFullscreenPlayer(channel)}
                    className={`tv-focusable group relative flex flex-col bg-[#112042] rounded-2xl p-3.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'is-focused border-white bg-[#162955]'
                        : 'border-[#22396B] hover:border-[#4DA3FF]/60 hover:bg-[#16274e]'
                    }`}
                  >
                    {/* Top Row: Resolution & Favorite */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#060D1F] text-[#4DA3FF] border border-[#22396B] font-bold">
                        {channel.resolution || 'FHD'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(channel.id);
                        }}
                        className={`p-1 rounded-md transition-colors ${
                          channel.isFavorite ? 'text-[#F5B820]' : 'text-[#8FA6CC]/40 hover:text-white'
                        }`}
                        title="Favori"
                      >
                        <Star className={`w-3.5 h-3.5 ${channel.isFavorite ? 'fill-[#F5B820]' : ''}`} />
                      </button>
                    </div>

                    {/* Channel Logo / Placeholder */}
                    <div className="h-20 w-full rounded-xl bg-[#060D1F] border border-[#22396B]/80 flex items-center justify-center p-2 mb-3 overflow-hidden relative group-hover:border-[#4DA3FF]/40">
                      {channel.logoUrl ? (
                        <img
                          src={channel.logoUrl}
                          alt={channel.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                          <Tv className="w-7 h-7 text-[#4DA3FF] mb-1" />
                        </div>
                      )}

                      {/* Live Badge */}
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-[#E5322D] text-white text-[9px] font-bold rounded uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>LIVE</span>
                      </div>
                    </div>

                    {/* Channel Title & Info */}
                    <h3 className="text-xs font-bold text-white truncate leading-tight group-hover:text-[#4DA3FF]">
                      {channel.name}
                    </h3>
                    <p className="text-[11px] text-[#8FA6CC] truncate mt-0.5">
                      {channel.category || channel.groupTitle}
                    </p>

                    {/* Mini progress bar for EPG */}
                    {channel.programProgress !== undefined && (
                      <div className="mt-2 w-full h-1 bg-[#060D1F] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1F7AE0] rounded-full"
                          style={{ width: `${channel.programProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION (32% width): tv_preview_panel matching activity_tv_main.xml */}
      <div className="flex-[0.32] bg-[#0A1530]/80 p-6 flex flex-col overflow-y-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#4DA3FF] mb-3 block">
          Aperçu de la sélection
        </span>

        {selectedChannel ? (
          <div className="flex flex-col gap-4">
            {/* Live Preview Video Box */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border-2 border-[#22396B] shadow-2xl group">
              <video
                ref={previewVideoRef}
                playsInline
                muted={isPreviewMuted}
                className="w-full h-full object-cover"
              />

              {/* Loading Overlay */}
              {isPreviewLoading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-3 border-[#1F7AE0] border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs text-[#8FA6CC]">Connexion au flux...</span>
                </div>
              )}

              {/* Error fallback */}
              {previewError && (
                <div className="absolute inset-0 bg-[#0E1A33]/90 flex flex-col items-center justify-center p-4 text-center">
                  <Tv className="w-8 h-8 text-[#E5324F] mb-2" />
                  <span className="text-xs font-bold text-white">Flux momentanément indisponible</span>
                  <span className="text-[10px] text-[#8FA6CC] mt-1">Cliquez pour tester en plein écran</span>
                </div>
              )}

              {/* Mute toggle for preview */}
              <button
                onClick={() => setIsPreviewMuted(!isPreviewMuted)}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                title={isPreviewMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isPreviewMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Play overlay button */}
              <button
                onClick={() => onOpenFullscreenPlayer(selectedChannel)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity"
              >
                <div className="w-12 h-12 rounded-full bg-[#1F7AE0] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Maximize2 className="w-6 h-6" />
                </div>
              </button>
            </div>

            {/* Selected Channel Metadata */}
            <div className="p-4 bg-[#112042] rounded-2xl border border-[#22396B] space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {selectedChannel.name}
                  </h2>
                  <p className="text-xs text-[#4DA3FF] font-medium mt-0.5">
                    {selectedChannel.category} · {selectedChannel.country || 'FR'}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#060D1F] text-[#2ECC71] text-xs font-mono font-bold border border-[#22396B]">
                  {selectedChannel.resolution || 'FHD'}
                </span>
              </div>

              {/* EPG Programs info */}
              <div className="pt-3 border-t border-[#22396B]/80 space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate">
                      {selectedChannel.currentProgram || 'Diffusion en Direct'}
                    </span>
                    <span className="text-[11px] text-[#8FA6CC] font-mono">
                      {selectedChannel.programProgress || 45}%
                    </span>
                  </div>
                  <div className="mt-1.5 w-full h-1.5 bg-[#060D1F] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1F7AE0] to-[#4DA3FF] rounded-full"
                      style={{ width: `${selectedChannel.programProgress || 45}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-[#8FA6CC]">
                  <span className="text-slate-500">Suivant : </span>
                  <span>{selectedChannel.nextProgram || 'Journal & Informations'}</span>
                </div>
              </div>

              {/* Big Full Screen CTA Button matching Wise IPTV Leanback style */}
              <button
                onClick={() => onOpenFullscreenPlayer(selectedChannel)}
                className="tv-focusable w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#2F8CF0] to-[#1B5FC4] hover:from-[#5BB0FF] hover:to-[#2F8CF0] text-white font-bold text-sm shadow-xl shadow-[#1F7AE0]/30 border border-white/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Plein Écran (OK)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#112042]/40 rounded-2xl border border-[#22396B]">
            <Tv className="w-10 h-10 text-[#8FA6CC] mb-2 opacity-60" />
            <p className="text-xs text-[#8FA6CC]">Sélectionnez une chaîne pour afficher l'aperçu en direct</p>
          </div>
        )}
      </div>
    </div>
  );
};
