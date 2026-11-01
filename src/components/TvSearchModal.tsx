import React, { useState, useEffect, useRef } from 'react';
import { Channel } from '../types/iptv';
import { Search, X, Play, Tv } from 'lucide-react';

interface TvSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onOpenFullscreen: (channel: Channel) => void;
}

export const TvSearchModal: React.FC<TvSearchModalProps> = ({
  isOpen,
  onClose,
  channels,
  onSelectChannel,
  onOpenFullscreen
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = channels.filter((ch) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      ch.name.toLowerCase().includes(q) ||
      ch.category.toLowerCase().includes(q) ||
      ch.groupTitle.toLowerCase().includes(q) ||
      (ch.country && ch.country.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0A1530] border-2 border-[#22396B] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#22396B]/80 flex items-center gap-3 bg-[#0C1E42]/80">
          <Search className="w-5 h-5 text-[#4DA3FF]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher une chaîne, un sport, un pays..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#8FA6CC] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#112042] text-xs font-semibold text-white hover:bg-[#1F7AE0] transition-colors"
          >
            Fermer
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-1.5">
          {!query.trim() ? (
            <div className="py-12 text-center text-xs text-[#8FA6CC]">
              Tapez le nom d'une chaîne ou d'une catégorie (ex: Sport, France, NASA, Cinéma)
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8FA6CC]">
              Aucun résultat pour "{query}"
            </div>
          ) : (
            results.map((ch) => (
              <div
                key={ch.id}
                onClick={() => {
                  onSelectChannel(ch);
                  onOpenFullscreen(ch);
                  onClose();
                }}
                className="tv-focusable flex items-center justify-between p-3 rounded-2xl bg-[#112042] hover:bg-[#1F7AE0] text-white cursor-pointer transition-colors border border-[#22396B]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#060D1F] flex items-center justify-center shrink-0">
                    <Tv className="w-4 h-4 text-[#4DA3FF]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{ch.name}</h4>
                    <p className="text-[11px] text-[#8FA6CC] truncate">{ch.category} · {ch.country || 'FR'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#060D1F] text-[#4DA3FF] font-mono font-bold">
                    {ch.resolution || 'FHD'}
                  </span>
                  <Play className="w-4 h-4 fill-current text-[#4DA3FF]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
