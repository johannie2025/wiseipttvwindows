import React, { useState } from 'react';
import { Playlist } from '../types/iptv';
import {
  FolderKanban,
  Plus,
  Trash2,
  RotateCw,
  FileText,
  Link,
  Server,
  Upload,
  X,
  CheckCircle2
} from 'lucide-react';

interface TvPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: Playlist[];
  onAddPlaylist: (playlist: Omit<Playlist, 'id' | 'lastUpdated'>, m3uContent?: string) => void;
  onDeletePlaylist: (id: string) => void;
  onSyncPlaylist: (id: string) => void;
}

export const TvPlaylistModal: React.FC<TvPlaylistModalProps> = ({
  isOpen,
  onClose,
  playlists,
  onAddPlaylist,
  onDeletePlaylist,
  onSyncPlaylist
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'xtream' | 'file'>('url');
  const [playlistName, setPlaylistName] = useState('');
  const [m3uUrl, setM3uUrl] = useState('');

  // Xtream Codes form
  const [xtreamServer, setXtreamServer] = useState('');
  const [xtreamUser, setXtreamUser] = useState('');
  const [xtreamPass, setXtreamPass] = useState('');

  // Local file
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'url') {
      if (!playlistName.trim() || !m3uUrl.trim()) return;
      onAddPlaylist({
        name: playlistName.trim(),
        url: m3uUrl.trim(),
        type: 'm3u_url',
        channelCount: 0,
        isActive: true
      });
    } else if (activeTab === 'xtream') {
      if (!playlistName.trim() || !xtreamServer.trim() || !xtreamUser.trim() || !xtreamPass.trim()) return;
      const cleanServer = xtreamServer.replace(/\/+$/, '');
      const constructedM3u = `${cleanServer}/get.php?username=${encodeURIComponent(xtreamUser)}&password=${encodeURIComponent(xtreamPass)}&type=m3u_plus&output=ts`;
      onAddPlaylist({
        name: playlistName.trim(),
        url: constructedM3u,
        type: 'xtream',
        serverUrl: cleanServer,
        username: xtreamUser,
        password: xtreamPass,
        channelCount: 0,
        isActive: true
      });
    } else if (activeTab === 'file') {
      if (!fileContent) return;
      onAddPlaylist(
        {
          name: playlistName.trim() || fileName || 'Playlist M3U Locale',
          type: 'm3u_file',
          channelCount: 0,
          isActive: true
        },
        fileContent
      );
    }

    // Reset & close
    setPlaylistName('');
    setM3uUrl('');
    setXtreamServer('');
    setXtreamUser('');
    setXtreamPass('');
    setFileContent('');
    setFileName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    if (!playlistName) {
      setPlaylistName(file.name.replace(/\.[^/.]+$/, ''));
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0A1530] border-2 border-[#22396B] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22396B]/80 bg-[#0C1E42]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#1F7AE0]/20 text-[#4DA3FF] border border-[#1F7AE0]/30">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Gestionnaire de Playlists IPTV</h2>
              <p className="text-xs text-[#8FA6CC]">Configurez vos bouquets M3U, M3U8 ou identifiants Xtream Codes API</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8FA6CC] hover:text-white hover:bg-[#112042] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT: Add Form matching dialog_add_playlist.xml */}
          <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-[#22396B]/70 overflow-y-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4DA3FF] block mb-3">
              Ajouter une nouvelle source
            </span>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#060D1F] rounded-xl mb-4 border border-[#22396B]">
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'url' ? 'bg-[#1F7AE0] text-white shadow' : 'text-[#8FA6CC] hover:text-white'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Lien M3U</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('xtream')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'xtream' ? 'bg-[#1F7AE0] text-white shadow' : 'text-[#8FA6CC] hover:text-white'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Xtream Codes</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'file' ? 'bg-[#1F7AE0] text-white shadow' : 'text-[#8FA6CC] hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Fichier M3U</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8FA6CC] block mb-1">
                  Nom de la playlist
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mon Bouquet IPTV France..."
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full bg-[#112042] border border-[#22396B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF]"
                  required
                />
              </div>

              {activeTab === 'url' && (
                <div>
                  <label className="text-xs font-semibold text-[#8FA6CC] block mb-1">
                    URL du lien M3U / M3U8
                  </label>
                  <input
                    type="url"
                    placeholder="http://iptv-provider.com/playlist.m3u"
                    value={m3uUrl}
                    onChange={(e) => setM3uUrl(e.target.value)}
                    className="w-full bg-[#112042] border border-[#22396B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF]"
                    required
                  />
                </div>
              )}

              {activeTab === 'xtream' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[#8FA6CC] block mb-1">
                      URL du serveur Xtream
                    </label>
                    <input
                      type="text"
                      placeholder="http://example-iptv.net:8080"
                      value={xtreamServer}
                      onChange={(e) => setXtreamServer(e.target.value)}
                      className="w-full bg-[#112042] border border-[#22396B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#8FA6CC] block mb-1">
                        Utilisateur
                      </label>
                      <input
                        type="text"
                        placeholder="Identifiant"
                        value={xtreamUser}
                        onChange={(e) => setXtreamUser(e.target.value)}
                        className="w-full bg-[#112042] border border-[#22396B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#8FA6CC] block mb-1">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={xtreamPass}
                        onChange={(e) => setXtreamPass(e.target.value)}
                        className="w-full bg-[#112042] border border-[#22396B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4DA3FF]"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'file' && (
                <div>
                  <label className="text-xs font-semibold text-[#8FA6CC] block mb-1">
                    Sélectionner le fichier .m3u ou .m3u8
                  </label>
                  <label className="border-2 border-dashed border-[#22396B] hover:border-[#4DA3FF] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#0E1A33]/50 transition-colors">
                    <Upload className="w-8 h-8 text-[#4DA3FF] mb-2" />
                    <span className="text-xs font-semibold text-white">
                      {fileName ? fileName : 'Choisir un fichier M3U sur votre PC'}
                    </span>
                    <span className="text-[10px] text-[#8FA6CC] mt-1">.m3u, .m3u8, .txt</span>
                    <input
                      type="file"
                      accept=".m3u,.m3u8,text/plain"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="tv-focusable w-full py-3 rounded-xl bg-gradient-to-r from-[#2F8CF0] to-[#1B5FC4] hover:from-[#5BB0FF] hover:to-[#2F8CF0] text-white font-bold text-xs shadow-lg shadow-[#1F7AE0]/30 border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Enregistrer & Synchroniser</span>
              </button>
            </form>
          </div>

          {/* RIGHT: Active Playlists list matching activity_playlist_manager.xml */}
          <div className="flex-1 p-6 bg-[#0E1A33]/50 overflow-y-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4DA3FF] block mb-3">
              Playlists Actives ({playlists.length})
            </span>

            <div className="space-y-3">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="p-4 bg-[#112042] rounded-2xl border border-[#22396B] flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{pl.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#060D1F] text-[#2ECC71] border border-[#22396B] font-mono font-bold">
                        {pl.channelCount} ch.
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8FA6CC] truncate mt-1">
                      {pl.type === 'xtream' ? 'Xtream Codes API' : pl.url || 'Fichier M3U importé'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onSyncPlaylist(pl.id)}
                      className="p-2 text-[#8FA6CC] hover:text-[#4DA3FF] hover:bg-[#060D1F] rounded-xl transition-colors"
                      title="Actualiser la liste"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    {pl.id !== 'pl-wise-official' && (
                      <button
                        onClick={() => onDeletePlaylist(pl.id)}
                        className="p-2 text-[#8FA6CC] hover:text-[#E5324F] hover:bg-[#060D1F] rounded-xl transition-colors"
                        title="Supprimer la playlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
