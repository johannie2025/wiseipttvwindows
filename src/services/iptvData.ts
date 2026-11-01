import { Channel, Playlist, DeviceActivation } from '../types/iptv';

export const INITIAL_DEVICE_ACTIVATION: DeviceActivation = {
  mac: '00:1A:79:B4:E7:38',
  deviceKey: '849204',
  isActivated: true,
  expiryDate: '01 Novembre 2027',
  status: 'active',
  providerLabel: 'Wise IPTV Cloud Streamline v4',
  login: 'wise_user_8492',
  password: '••••••••••••'
};

export const DEFAULT_CHANNELS: Channel[] = [
  {
    id: 'f24_fr',
    name: 'France 24 Français HD',
    category: 'Information',
    groupTitle: 'France',
    country: 'FR',
    language: 'Français',
    streamUrl: 'https://static.france24.com/live/F24_FR_LO_HLS/live_tv.m3u8',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/France_24_logo.svg/300px-France_24_logo.svg.png',
    currentProgram: 'Le Journal Monde & Décryptage',
    nextProgram: 'Éco & Débat Politique',
    programProgress: 42,
    resolution: 'FHD',
    isFavorite: true
  },
  {
    id: 'f24_en',
    name: 'France 24 English HD',
    category: 'Information',
    groupTitle: 'International',
    country: 'FR',
    language: 'Anglais',
    streamUrl: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/France_24_logo.svg/300px-France_24_logo.svg.png',
    currentProgram: 'World News Bulletin Live',
    nextProgram: 'Global Energy Transition',
    programProgress: 65,
    resolution: 'FHD',
    isFavorite: false
  },
  {
    id: 'euronews_fr',
    name: 'Euronews Direct Français',
    category: 'Information',
    groupTitle: 'France',
    country: 'EU',
    language: 'Français',
    streamUrl: 'https://euronews-euronews-french-1-fr.samsung.wurl.tv/playlist.m3u8',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Euronews_2016_logo.svg/320px-Euronews_2016_logo.svg.png',
    currentProgram: 'Euronews Soir & Analyse',
    nextProgram: 'Europe Hebdo',
    programProgress: 20,
    resolution: 'FHD',
    isFavorite: true
  },
  {
    id: 'redbull_tv',
    name: 'Red Bull TV Extreme Sports',
    category: 'Sport',
    groupTitle: 'Sport',
    country: 'AT',
    language: 'Anglais',
    streamUrl: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Red_Bull_TV_logo.svg/320px-Red_Bull_TV_logo.svg.png',
    currentProgram: 'UCI Mountain Bike World Cup 2026',
    nextProgram: 'Cliff Diving Series Live',
    programProgress: 78,
    resolution: '4K',
    isFavorite: true
  },
  {
    id: 'nasa_tv',
    name: 'NASA TV Ultra HD Space Stream',
    category: 'Documentaires',
    groupTitle: 'Science',
    country: 'US',
    language: 'Anglais',
    streamUrl: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/320px-NASA_logo.svg.png',
    currentProgram: 'ISS Live Earth Views & Spacewalk',
    nextProgram: 'Artemis Moon Mission Briefing',
    programProgress: 50,
    resolution: '4K',
    isFavorite: false
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg TV Live Markets',
    category: 'Économie',
    groupTitle: 'International',
    country: 'US',
    language: 'Anglais',
    streamUrl: 'https://liveproduseast.global.ssl.fastly.net/us/Channel-USTV-AWS-virginia-1/Source-4000-1000-bp3m8_live.m3u8',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bloomberg_logo.svg/320px-Bloomberg_logo.svg.png',
    currentProgram: 'Bloomberg Markets: The Close',
    nextProgram: 'Technology Radar Special',
    programProgress: 35,
    resolution: 'FHD',
    isFavorite: false
  },
  {
    id: 'arte_concert',
    name: 'Arte Concert & Culture',
    category: 'Musique',
    groupTitle: 'Culture',
    country: 'FR',
    language: 'Français',
    streamUrl: 'https://artesimulcast.akamaized.net/hls/live/2031003/artelive_fr/index.m3u8',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Arte_logo_2017.svg/320px-Arte_logo_2017.svg.png',
    currentProgram: 'Philharmonie de Paris Live',
    nextProgram: 'Tracks Musique Underground',
    programProgress: 15,
    resolution: 'FHD',
    isFavorite: true
  },
  {
    id: 'dw_fr',
    name: 'Deutsche Welle Français',
    category: 'Information',
    groupTitle: 'International',
    country: 'DE',
    language: 'Français',
    streamUrl: 'https://dwamdstream104.akamaized.net/hls/live/2015530/dwstream104/index.m3u8',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Deutsche_Welle_logo.svg/320px-Deutsche_Welle_logo.svg.png',
    currentProgram: 'Le Journal Afrique & Europe',
    nextProgram: 'Reporter Grand Format',
    programProgress: 88,
    resolution: 'HD',
    isFavorite: false
  },
  {
    id: 'cinema_classic',
    name: 'Cinéma Nostalgie HD',
    category: 'Cinéma & Séries',
    groupTitle: 'Cinéma',
    country: 'FR',
    language: 'Français',
    streamUrl: 'https://amg01269-cinedigm-filmriseclassicst-samsungus-e76k4.amagi.tv/playlist/amg01269-cinedigm-filmriseclassicst-samsungus/playlist.m3u8',
    logoUrl: '',
    currentProgram: 'Les Tontons Flingueurs (Version Restaurée)',
    nextProgram: 'La Nuit du Chasseur',
    programProgress: 52,
    resolution: 'FHD',
    isFavorite: true
  },
  {
    id: 'sport_action',
    name: 'Sport Action Extreme World',
    category: 'Sport',
    groupTitle: 'Sport',
    country: 'FR',
    language: 'Français',
    streamUrl: 'https://origin.outdoortv.com/live/outdoortv/playlist.m3u8',
    logoUrl: '',
    currentProgram: 'Motorsport Rallye Champions Live',
    nextProgram: 'Supercross Finals',
    programProgress: 30,
    resolution: 'FHD',
    isFavorite: false
  }
];

export const DEFAULT_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-wise-official',
    name: 'Wise IPTV Bouquet Général',
    url: 'https://wise-iptv.com/api/bouquet_general.m3u',
    type: 'm3u_url',
    channelCount: DEFAULT_CHANNELS.length,
    lastUpdated: Date.now() - 3600000,
    isActive: true
  }
];

/**
 * Robust M3U Parser matching M3UParser.java in wiseiptv-main
 */
export function parseM3UContent(content: string, playlistId = 'custom'): Channel[] {
  const lines = content.split('\n');
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> | null = null;
  let order = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    if (rawLine.startsWith('#EXTINF')) {
      currentChannel = {
        id: `m3u-${playlistId}-${order++}-${Date.now()}`,
        resolution: 'FHD',
        programProgress: Math.floor(Math.random() * 80) + 10
      };

      // Name after the last comma
      const commaIdx = rawLine.lastIndexOf(',');
      if (commaIdx >= 0) {
        currentChannel.name = rawLine.substring(commaIdx + 1).trim() || 'Chaîne Inconnue';
      } else {
        currentChannel.name = 'Chaîne Inconnue';
      }

      // Attributes
      currentChannel.logoUrl = extractAttr(rawLine, 'tvg-logo') || undefined;
      currentChannel.epgChannelId = extractAttr(rawLine, 'tvg-id') || undefined;
      currentChannel.country = extractAttr(rawLine, 'tvg-country') || 'FR';
      currentChannel.language = extractAttr(rawLine, 'tvg-language') || 'Français';
      
      const group = extractAttr(rawLine, 'group-title') || 'Général';
      currentChannel.groupTitle = group;
      currentChannel.category = group;
      currentChannel.currentProgram = 'Diffusion en direct';
      currentChannel.nextProgram = 'Programme suivant';
    } else if (!rawLine.startsWith('#') && currentChannel) {
      currentChannel.streamUrl = rawLine;
      channels.push(currentChannel as Channel);
      currentChannel = null;
    }
  }

  return channels;
}

function extractAttr(line: string, attr: string): string | null {
  const search = `${attr}="`;
  const s = line.indexOf(search);
  if (s < 0) return null;
  const startVal = s + search.length;
  const endVal = line.indexOf('"', startVal);
  if (endVal < 0) return null;
  return line.substring(startVal, endVal).trim() || null;
}
