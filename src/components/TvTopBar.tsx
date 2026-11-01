import React from 'react';
import { Search, Plus, RotateCw, History, FolderKanban, KeyRound, MonitorDown, Tv } from 'lucide-react';

interface TvTopBarProps {
  onOpenSearch: () => void;
  onOpenAddPlaylist: () => void;
  onSync: () => void;
  isSyncing: boolean;
  onOpenRecents: () => void;
  onOpenPlaylists: () => void;
  onOpenActivation: () => void;
  onOpenElectronBuild: () => void;
  subscriptionExpiry: string;
  isActivated: boolean;
}

export const TvTopBar: React.FC<TvTopBarProps> = ({
  onOpenSearch,
  onOpenAddPlaylist,
  onSync,
  isSyncing,
  onOpenRecents,
  onOpenPlaylists,
  onOpenActivation,
  onOpenElectronBuild,
  subscriptionExpiry,
  isActivated
}) => {
  return (
    <header className="h-[68px] w-full flex items-center justify-between px-6 bg-[#0A1530]/95 backdrop-blur-md border-b border-[#22396B]/60 shadow-xl z-30 shrink-0">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <img
          src="/wiseiptv_logo.png"
          alt="Wise IPTV"
          className="w-10 h-10 object-contain drop-shadow"
          onError={(e) => {
            // fallback if logo missing
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            Wise IPTV <span className="text-xs px-2 py-0.5 rounded bg-[#1F7AE0]/30 text-[#4DA3FF] border border-[#1F7AE0]/50 font-mono font-semibold">TV</span>
          </span>
        </div>
      </div>

      {/* Subscription Status Pill */}
      <div className="hidden lg:flex items-center gap-2">
        <button
          onClick={onOpenActivation}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
            isActivated
              ? 'bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40 hover:bg-[#2ECC71]/30'
              : 'bg-[#E5324F]/20 text-[#E5324F] border border-[#E5324F]/40 hover:bg-[#E5324F]/30'
          }`}
          title="Gérer l'activation"
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span>{isActivated ? `ABONNEMENT ACTIF · ${subscriptionExpiry}` : 'ACTIVER MON APPAREIL'}</span>
        </button>
      </div>

      {/* Action Buttons (Leanback Navigation) */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="tv-focusable h-10 px-3.5 rounded-xl bg-[#112042] hover:bg-[#1F7AE0] text-white flex items-center justify-center gap-2 text-xs font-semibold border border-[#22396B] transition-colors"
          title="Rechercher une chaîne (F3)"
        >
          <Search className="w-4 h-4 text-[#4DA3FF]" />
          <span className="hidden sm:inline">Recherche</span>
        </button>

        {/* Add Playlist */}
        <button
          onClick={onOpenAddPlaylist}
          className="tv-focusable h-10 px-3.5 rounded-xl bg-[#112042] hover:bg-[#1F7AE0] text-white flex items-center justify-center gap-2 text-xs font-semibold border border-[#22396B] transition-colors"
          title="Ajouter une playlist M3U ou Xtream"
        >
          <Plus className="w-4 h-4 text-[#4DA3FF]" />
          <span className="hidden sm:inline">Ajouter</span>
        </button>

        {/* Sync */}
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="tv-focusable h-10 px-3 rounded-xl bg-[#112042] hover:bg-[#1F7AE0] text-white flex items-center justify-center border border-[#22396B] transition-colors"
          title="Actualiser les flux"
        >
          <RotateCw className={`w-4 h-4 text-[#4DA3FF] ${isSyncing ? 'animate-spin' : ''}`} />
        </button>

        {/* Recents */}
        <button
          onClick={onOpenRecents}
          className="tv-focusable h-10 px-3 rounded-xl bg-[#112042] hover:bg-[#1F7AE0] text-white flex items-center justify-center border border-[#22396B] transition-colors"
          title="Chaînes récentes"
        >
          <History className="w-4 h-4 text-[#4DA3FF]" />
        </button>

        {/* Playlists Manager */}
        <button
          onClick={onOpenPlaylists}
          className="tv-focusable h-10 px-3.5 rounded-xl bg-[#112042] hover:bg-[#1F7AE0] text-white flex items-center justify-center gap-2 text-xs font-semibold border border-[#22396B] transition-colors"
          title="Gestionnaire de playlists"
        >
          <FolderKanban className="w-4 h-4 text-[#4DA3FF]" />
          <span className="hidden md:inline">Playlists</span>
        </button>

        {/* Activation */}
        <button
          onClick={onOpenActivation}
          className="tv-focusable h-10 px-3.5 rounded-xl bg-[#112042] hover:bg-[#1F7AE0] text-white flex items-center justify-center gap-2 text-xs font-semibold border border-[#22396B] transition-colors"
          title="Informations d'activation"
        >
          <KeyRound className="w-4 h-4 text-[#F5B820]" />
          <span className="hidden md:inline">Activation</span>
        </button>

        {/* Windows EXE & GitHub Actions */}
        <button
          onClick={onOpenElectronBuild}
          className="tv-focusable h-10 px-4 rounded-xl bg-gradient-to-r from-[#FF4A68] to-[#E5324F] hover:from-[#FF6F88] hover:to-[#FF4A68] text-white flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-[#E5324F]/30 border border-white/20 transition-transform active:scale-95"
          title="Compiler pour Windows (.exe) via GitHub Actions"
        >
          <MonitorDown className="w-4 h-4" />
          <span>EXE Windows</span>
        </button>
      </div>
    </header>
  );
};
