import React, { useState } from 'react';
import {
  generateElectronProjectZip,
  downloadBlob,
  GITHUB_WORKFLOW_YML
} from '../services/electronZipExporter';
import {
  Download,
  Copy,
  Check,
  FileCode,
  Terminal,
  Cpu,
  Monitor,
  PackageCheck,
  X,
  Tv,
  CheckCircle2
} from 'lucide-react';

interface TvElectronBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TvElectronBuildModal: React.FC<TvElectronBuildModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'zip' | 'workflow' | 'local'>('guide');
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyWorkflow = async () => {
    try {
      await navigator.clipboard.writeText(GITHUB_WORKFLOW_YML);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownloadZip = async () => {
    setIsGeneratingZip(true);
    setZipSuccess(false);
    try {
      const zipBlob = await generateElectronProjectZip();
      downloadBlob(zipBlob, 'WiseIPTV-TV-Windows-Electron.zip');
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0A1530] border-2 border-[#22396B] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22396B]/80 bg-[#0C1E42]/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#1F7AE0]/30 to-[#E5324F]/30 text-white rounded-2xl border border-white/20">
              <Tv className="w-6 h-6 text-[#4DA3FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Wise IPTV TV — Compilation Windows (.exe)</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#2ECC71]/20 text-[#2ECC71] rounded-full border border-[#2ECC71]/30 font-bold">
                  GitHub Actions Ready
                </span>
              </div>
              <p className="text-xs text-[#8FA6CC]">Générez gratuitement vos exécutables Windows NSIS & Portable avec le design exact TV</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8FA6CC] hover:text-white hover:bg-[#112042] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-[#22396B]/80 bg-[#060D1F] text-xs">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'guide'
                ? 'bg-[#1F7AE0] text-white font-semibold'
                : 'text-[#8FA6CC] hover:text-white hover:bg-[#112042]'
            }`}
          >
            Guide GitHub Actions (3 min)
          </button>

          <button
            onClick={() => setActiveTab('zip')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'zip'
                ? 'bg-[#1F7AE0] text-white font-semibold'
                : 'text-[#8FA6CC] hover:text-white hover:bg-[#112042]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger le Projet (ZIP)</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'bg-[#1F7AE0] text-white font-semibold'
                : 'text-[#8FA6CC] hover:text-white hover:bg-[#112042]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Workflow GitHub Actions (.yml)</span>
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'local'
                ? 'bg-[#1F7AE0] text-white font-semibold'
                : 'text-[#8FA6CC] hover:text-white hover:bg-[#112042]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Build Local (PC)</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'guide' && (
            <div className="space-y-6">
              {/* Callout */}
              <div className="p-5 bg-gradient-to-r from-[#0C1E42] via-[#0E1A33] to-[#060D1F] border border-[#22396B] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Prêt à compiler sur GitHub Actions</h3>
                  <p className="text-xs text-[#8FA6CC] mt-1">
                    Le workflow utilise les serveurs Windows de GitHub (<code className="text-[#4DA3FF] font-mono">windows-latest</code>) pour compiler automatiquement les deux exécutables Windows :
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs font-mono text-[#4DA3FF]">
                    <span>1. WiseIPTV-Setup-1.0.0.exe (Installateur)</span>
                    <span>·</span>
                    <span>2. WiseIPTV-1.0.0-portable.exe (Portable)</span>
                  </div>
                </div>

                <button
                  onClick={handleDownloadZip}
                  disabled={isGeneratingZip}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#FF4A68] to-[#E5324F] hover:from-[#FF6F88] hover:to-[#FF4A68] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#E5324F]/30 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingZip ? 'Génération du ZIP...' : 'Télécharger le ZIP Complet'}</span>
                </button>
              </div>

              {/* 3 Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#112042] border border-[#22396B] rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1F7AE0]/20 text-[#4DA3FF] font-mono font-bold flex items-center justify-center text-sm">
                    01
                  </div>
                  <h4 className="text-sm font-semibold text-white">Télécharger & Pusher</h4>
                  <p className="text-xs text-[#8FA6CC]">
                    Téléchargez l'archive ZIP et poussez le code sur votre nouveau dépôt GitHub :
                  </p>
                  <div className="p-2 bg-[#060D1F] rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto border border-[#22396B]">
                    git init<br />
                    git add .<br />
                    git commit -m "feat: wise iptv tv"<br />
                    git push origin main
                  </div>
                </div>

                <div className="p-4 bg-[#112042] border border-[#22396B] rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1F7AE0]/20 text-[#4DA3FF] font-mono font-bold flex items-center justify-center text-sm">
                    02
                  </div>
                  <h4 className="text-sm font-semibold text-white">Compilation Automatique</h4>
                  <p className="text-xs text-[#8FA6CC]">
                    GitHub Actions démarre automatiquement le workflow <code className="text-[#4DA3FF]">build-electron-windows.yml</code> sur un runner Windows Server.
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    Durée moyenne : 2 à 3 minutes.
                  </p>
                </div>

                <div className="p-4 bg-[#112042] border border-[#22396B] rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2ECC71]/20 text-[#2ECC71] font-mono font-bold flex items-center justify-center text-sm">
                    03
                  </div>
                  <h4 className="text-sm font-semibold text-white">Télécharger vos .exe</h4>
                  <p className="text-xs text-[#8FA6CC]">
                    Dans l'onglet <strong>Actions</strong> de GitHub, téléchargez l'archive dans <strong>Artifacts</strong> :
                  </p>
                  <div className="p-2 bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-lg text-[#2ECC71] text-xs font-semibold flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4" />
                    <span>WiseIPTV-TV-Windows-Executables.zip</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'zip' && (
            <div className="space-y-6 text-center max-w-lg mx-auto py-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1F7AE0]/20 text-[#4DA3FF] flex items-center justify-center mx-auto mb-4 border border-[#1F7AE0]/40 shadow-xl">
                <PackageCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Archive Complète du Projet Prête à Déployer</h3>
              <p className="text-xs text-[#8FA6CC] mt-1">
                Contient l'intégralité du lecteur Wise IPTV TV Windows, les scripts Electron (<code className="text-[#4DA3FF]">electron/main.cjs</code>), la configuration <code className="text-[#4DA3FF]">electron-builder.json</code> et le workflow GitHub Actions.
              </p>

              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  onClick={handleDownloadZip}
                  disabled={isGeneratingZip}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#2F8CF0] to-[#1B5FC4] hover:from-[#5BB0FF] hover:to-[#2F8CF0] text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-xl shadow-[#1F7AE0]/30 active:scale-95 transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>{isGeneratingZip ? 'Création de l\'archive ZIP...' : 'Télécharger WiseIPTV-TV-Windows-Electron.zip'}</span>
                </button>

                {zipSuccess && (
                  <div className="flex items-center gap-2 text-xs text-[#2ECC71] bg-[#2ECC71]/20 border border-[#2ECC71]/40 px-3 py-1.5 rounded-lg animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Téléchargement déclenché avec succès !</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">.github/workflows/build-electron-windows.yml</h3>
                  <p className="text-xs text-[#8FA6CC]">Workflow de compilation GitHub Actions pour Windows x64</p>
                </div>
                <button
                  onClick={handleCopyWorkflow}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#112042] hover:bg-[#1F7AE0] text-white rounded-lg text-xs font-semibold transition-colors border border-[#22396B]"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2ECC71]" />
                      <span className="text-[#2ECC71]">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le YAML</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-[#060D1F] border border-[#22396B] rounded-2xl font-mono text-xs text-[#4DA3FF]/90 overflow-x-auto max-h-[400px]">
                {GITHUB_WORKFLOW_YML}
              </pre>
            </div>
          )}

          {activeTab === 'local' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Compiler localement sur votre machine Windows</h3>
              <div className="space-y-3">
                <div className="p-3 bg-[#060D1F] border border-[#22396B] rounded-xl">
                  <span className="text-[11px] text-[#8FA6CC] font-mono block mb-1">1. Installer les modules</span>
                  <code className="text-xs font-mono text-[#4DA3FF]">npm install</code>
                </div>

                <div className="p-3 bg-[#060D1F] border border-[#22396B] rounded-xl">
                  <span className="text-[11px] text-[#8FA6CC] font-mono block mb-1">2. Tester l'application en mode bureau</span>
                  <code className="text-xs font-mono text-[#4DA3FF]">npm run electron:dev</code>
                </div>

                <div className="p-3 bg-[#060D1F] border border-[#22396B] rounded-xl">
                  <span className="text-[11px] text-[#8FA6CC] font-mono block mb-1">3. Compiler les fichiers .exe (Installateur NSIS + Portable)</span>
                  <code className="text-xs font-mono text-[#4DA3FF]">npm run electron:build:win</code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#22396B]/80 bg-[#0C1E42]/80 flex items-center justify-between text-xs text-[#8FA6CC]">
          <span>Wise IPTV TV — Optimisé pour Windows 10 & 11 (x64)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#112042] hover:bg-[#1F7AE0] text-white rounded-xl font-medium transition-colors border border-[#22396B]"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
