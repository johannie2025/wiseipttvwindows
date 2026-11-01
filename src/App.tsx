import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Channel, Playlist, DeviceActivation } from './types/iptv';
import {
  DEFAULT_CHANNELS,
  DEFAULT_PLAYLISTS,
  INITIAL_DEVICE_ACTIVATION,
  parseM3UContent
} from './services/iptvData';
import { TvTopBar } from './components/TvTopBar';
import { TvMainView } from './components/TvMainView';
import { TvPlayerView } from './components/TvPlayerView';
import { TvActivationModal } from './components/TvActivationModal';
import { TvPlaylistModal } from './components/TvPlaylistModal';
import { TvSearchModal } from './components/TvSearchModal';
import { TvElectronBuildModal } from './components/TvElectronBuildModal';

export default function App() {
  // Channels state
  const [channels, setChannels] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem('wise_tv_channels');
      return saved ? JSON.parse(saved) : DEFAULT_CHANNELS;
    } catch {
      return DEFAULT_CHANNELS;
    }
  });

  // Playlists state
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('wise_tv_playlists');
      return saved ? JSON.parse(saved) : DEFAULT_PLAYLISTS;
    } catch {
      return DEFAULT_PLAYLISTS;
    }
  });

  // Recents state (max 30, matching MAX_RECENTS = 30 in wiseiptv-main)
  const [recents, setRecents] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem('wise_tv_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Device Activation state
  const [activation, setActivation] = useState<DeviceActivation>(() => {
    try {
      const saved = localStorage.getItem('wise_tv_activation');
      return saved ? JSON.parse(saved) : INITIAL_DEVICE_ACTIVATION;
    } catch {
      return INITIAL_DEVICE_ACTIVATION;
    }
  });

  // Active channel selection
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(() => {
    return channels[0] || null;
  });

  // Active Category filter
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals visibility
  const [isFullscreenPlayer, setIsFullscreenPlayer] = useState<boolean>(false);
  const [isActivationOpen, setIsActivationOpen] = useState<boolean>(false);
  const [isPlaylistsOpen, setIsPlaylistsOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isElectronModalOpen, setIsElectronModalOpen] = useState<boolean>(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('wise_tv_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('wise_tv_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('wise_tv_recents', JSON.stringify(recents));
  }, [recents]);

  // Compute Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('Tous');
    set.add('Favoris');
    channels.forEach((ch) => {
      if (ch.category) set.add(ch.category);
      if (ch.groupTitle && ch.groupTitle !== ch.category) set.add(ch.groupTitle);
    });
    return Array.from(set);
  }, [channels]);

  // Handle Select Channel
  const handleSelectChannel = useCallback((channel: Channel) => {
    setSelectedChannel(channel);
    // Add to recents
    setRecents((prev) => {
      const filtered = prev.filter((c) => c.id !== channel.id);
      return [channel, ...filtered].slice(0, 30);
    });
  }, []);

  // Handle Fullscreen Player
  const handleOpenFullscreen = useCallback((channel: Channel) => {
    setSelectedChannel(channel);
    setIsFullscreenPlayer(true);
    setRecents((prev) => {
      const filtered = prev.filter((c) => c.id !== channel.id);
      return [channel, ...filtered].slice(0, 30);
    });
  }, []);

  // Toggle Favorite
  const handleToggleFavorite = useCallback((channelId: string | number) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, isFavorite: !ch.isFavorite } : ch))
    );
    setSelectedChannel((prev) =>
      prev && prev.id === channelId ? { ...prev, isFavorite: !prev.isFavorite } : prev
    );
  }, []);

  // Sync Channels
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  // Add Playlist
  const handleAddPlaylist = (newPlData: Omit<Playlist, 'id' | 'lastUpdated'>, m3uContent?: string) => {
    let parsedChannels: Channel[] = [];
    if (m3uContent) {
      parsedChannels = parseM3UContent(m3uContent, `pl-${Date.now()}`);
    }

    const newPlaylist: Playlist = {
      ...newPlData,
      id: `pl-${Date.now()}`,
      channelCount: parsedChannels.length > 0 ? parsedChannels.length : 12,
      lastUpdated: Date.now()
    };

    setPlaylists((prev) => [...prev, newPlaylist]);

    if (parsedChannels.length > 0) {
      setChannels((prev) => [...prev, ...parsedChannels]);
      setSelectedChannel(parsedChannels[0]);
    }

    setIsPlaylistsOpen(false);
  };

  // Delete Playlist
  const handleDeletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  };

  // Sync specific playlist
  const handleSyncPlaylist = (id: string) => {
    handleSync();
  };

  // D-Pad Keyboard Navigation matching TV Leanback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input, ignore
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (isFullscreenPlayer) return;

      const filtered = channels.filter((ch) => {
        if (activeCategory === 'Tous') return true;
        if (activeCategory === 'Favoris') return ch.isFavorite;
        return ch.category === activeCategory || ch.groupTitle === activeCategory;
      });

      const currentIdx = filtered.findIndex((c) => c.id === selectedChannel?.id);

      if (e.key === 'ArrowRight') {
        if (currentIdx >= 0 && currentIdx < filtered.length - 1) {
          handleSelectChannel(filtered[currentIdx + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIdx > 0) {
          handleSelectChannel(filtered[currentIdx - 1]);
        }
      } else if (e.key === 'ArrowDown') {
        // Jump row (approx 4 columns)
        if (currentIdx >= 0 && currentIdx + 4 < filtered.length) {
          handleSelectChannel(filtered[currentIdx + 4]);
        }
      } else if (e.key === 'ArrowUp') {
        if (currentIdx - 4 >= 0) {
          handleSelectChannel(filtered[currentIdx - 4]);
        }
      } else if (e.key === 'Enter') {
        if (selectedChannel) {
          handleOpenFullscreen(selectedChannel);
        }
      } else if (e.key === 'F3' || (e.ctrlKey && e.key === 'f')) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [channels, activeCategory, selectedChannel, isFullscreenPlayer, handleSelectChannel, handleOpenFullscreen]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-b from-[#0C1E42] via-[#060D1F] to-[#040814] text-white font-sans select-none">
      {/* Leanback TV Top Bar */}
      <TvTopBar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddPlaylist={() => setIsPlaylistsOpen(true)}
        onSync={handleSync}
        isSyncing={isSyncing}
        onOpenRecents={() => {
          if (recents.length > 0) {
            setChannels((prev) => {
              const unique = Array.from(new Set([...recents, ...prev]));
              return unique;
            });
            setActiveCategory('Récents');
          }
        }}
        onOpenPlaylists={() => setIsPlaylistsOpen(true)}
        onOpenActivation={() => setIsActivationOpen(true)}
        onOpenElectronBuild={() => setIsElectronModalOpen(true)}
        subscriptionExpiry={activation.expiryDate}
        isActivated={activation.isActivated}
      />

      {/* Main Browse Fragment & Live Preview Panel (68% / 32% Leanback Architecture) */}
      <TvMainView
        channels={activeCategory === 'Récents' ? recents : channels}
        selectedChannel={selectedChannel}
        onSelectChannel={handleSelectChannel}
        onOpenFullscreenPlayer={handleOpenFullscreen}
        onToggleFavorite={handleToggleFavorite}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        categories={categories}
      />

      {/* Fullscreen TV Player Modal */}
      {isFullscreenPlayer && selectedChannel && (
        <TvPlayerView
          channel={selectedChannel}
          channels={channels}
          onClose={() => setIsFullscreenPlayer(false)}
          onSelectChannel={handleSelectChannel}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Device Activation Modal matching activity_tv_activation.xml */}
      <TvActivationModal
        isOpen={isActivationOpen}
        onClose={() => setIsActivationOpen(false)}
        activation={activation}
        onRefreshActivation={() => {
          setActivation((prev) => ({
            ...prev,
            isActivated: true,
            status: 'active'
          }));
        }}
      />

      {/* Playlist Manager Modal matching activity_playlist_manager.xml */}
      <TvPlaylistModal
        isOpen={isPlaylistsOpen}
        onClose={() => setIsPlaylistsOpen(false)}
        playlists={playlists}
        onAddPlaylist={handleAddPlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        onSyncPlaylist={handleSyncPlaylist}
      />

      {/* Search Modal */}
      <TvSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        channels={channels}
        onSelectChannel={handleSelectChannel}
        onOpenFullscreen={handleOpenFullscreen}
      />

      {/* Electron Windows Build & GitHub Actions Modal */}
      <TvElectronBuildModal
        isOpen={isElectronModalOpen}
        onClose={() => setIsElectronModalOpen(false)}
      />
    </div>
  );
}
