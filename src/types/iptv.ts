export interface Channel {
  id: string | number;
  name: string;
  streamUrl: string;
  logoUrl?: string;
  category: string;
  groupTitle: string;
  country?: string;
  language?: string;
  isFavorite?: boolean;
  epgChannelId?: string;
  currentProgram?: string;
  nextProgram?: string;
  programProgress?: number; // 0-100
  resolution?: '4K' | 'FHD' | 'HD' | 'SD';
}

export interface Playlist {
  id: string;
  name: string;
  url?: string;
  type: 'm3u_url' | 'm3u_file' | 'xtream';
  channelCount: number;
  lastUpdated: number;
  serverUrl?: string;
  username?: string;
  password?: string;
  isActive?: boolean;
}

export interface DeviceActivation {
  mac: string;
  deviceKey: string;
  isActivated: boolean;
  expiryDate: string;
  status: 'active' | 'trial' | 'expired';
  providerLabel?: string;
  login?: string;
  password?: string;
}

export type AspectRatio = '16:9' | '4:3' | 'zoom' | 'original';

export type TVSection = 'main' | 'player' | 'activation' | 'playlists' | 'search' | 'github_actions';
