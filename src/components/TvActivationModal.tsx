import React, { useState } from 'react';
import { DeviceActivation } from '../types/iptv';
import { KeyRound, CheckCircle2, RotateCw, QrCode, ShieldCheck, X, Tv, ArrowRight } from 'lucide-react';

interface TvActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activation: DeviceActivation;
  onRefreshActivation: () => void;
}

export const TvActivationModal: React.FC<TvActivationModalProps> = ({
  isOpen,
  onClose,
  activation,
  onRefreshActivation
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkSuccessMessage, setCheckSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleCheck = () => {
    setIsChecking(true);
    setCheckSuccessMessage(false);
    setTimeout(() => {
      setIsChecking(false);
      setCheckSuccessMessage(true);
      onRefreshActivation();
      setTimeout(() => setCheckSuccessMessage(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#0C1E42] to-[#040814] border-2 border-[#22396B] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#8FA6CC] hover:text-white hover:bg-[#112042] rounded-xl transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* LEFT COLUMN: Logo, Device MAC & Key */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#22396B]/60">
          <div>
            {/* Header Lockup */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/wiseiptv_logo.png"
                alt="Wise IPTV"
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Wise IPTV</h2>
                <p className="text-sm text-[#8FA6CC]">Activation de votre téléviseur & Windows</p>
              </div>
            </div>

            {/* Device Identifiers Card */}
            <div className="p-5 bg-[#112042] rounded-2xl border border-[#22396B] space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#22396B]/80 pb-3">
                <span className="text-xs uppercase tracking-wider text-[#8FA6CC] font-bold">
                  Adresse MAC Appareil
                </span>
                <span className="font-mono text-sm font-bold text-white tracking-wider px-2.5 py-1 bg-[#060D1F] rounded-lg border border-[#22396B]">
                  {activation.mac}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#8FA6CC] font-bold">
                  Device Key (Clé Unique)
                </span>
                <span className="font-mono text-base font-extrabold text-[#4DA3FF] tracking-widest px-3 py-1 bg-[#060D1F] rounded-lg border border-[#1F7AE0]/40">
                  {activation.deviceKey}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 space-y-2 text-xs text-[#8FA6CC]">
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1F7AE0]/20 text-[#4DA3FF] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>Rendez-vous sur le portail Web : <strong className="text-white">https://wise-iptv.com/activate</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1F7AE0]/20 text-[#4DA3FF] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>Entrez votre adresse MAC et votre Device Key ci-dessus.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#1F7AE0]/20 text-[#4DA3FF] font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <span>Ajoutez vos liens M3U ou codes Xtream puis cliquez sur Vérifier.</span>
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#22396B]/60 flex items-center gap-2 text-xs text-[#2ECC71]">
            <ShieldCheck className="w-4 h-4" />
            <span>Sécurité matérielle certifiée Wise IPTV v4.2</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Subscription status & Action buttons */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between bg-[#0A1530]/60">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4DA3FF] mb-4">
              Statut de la licence
            </h3>

            {/* Active Subscription Details Card */}
            <div className="p-5 bg-[#112042] rounded-2xl border border-[#2ECC71]/40 shadow-xl space-y-3 mb-6">
              <div className="flex items-center gap-2 text-[#2ECC71] text-sm font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Accès TV Premium Activé</span>
              </div>

              <div className="space-y-1.5 text-xs text-[#8FA6CC] pt-2">
                <p>Fournisseur : <strong className="text-white">{activation.providerLabel}</strong></p>
                <p>Identifiant : <strong className="text-white font-mono">{activation.login}</strong></p>
                <p>Mot de passe : <strong className="text-white font-mono">{activation.password}</strong></p>
                <p className="text-[#4DA3FF] font-semibold pt-1">
                  Expire le : {activation.expiryDate}
                </p>
              </div>
            </div>

            {checkSuccessMessage && (
              <div className="p-3 mb-4 rounded-xl bg-[#2ECC71]/20 border border-[#2ECC71]/40 text-[#2ECC71] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Licence vérifiée avec succès. Toutes vos chaînes sont synchronisées !</span>
              </div>
            )}
          </div>

          {/* Action buttons matching Wise.Button.TV in wiseiptv */}
          <div className="space-y-3">
            <button
              onClick={handleCheck}
              disabled={isChecking}
              className="tv-focusable w-full h-14 rounded-2xl bg-gradient-to-r from-[#2F8CF0] to-[#1B5FC4] hover:from-[#5BB0FF] hover:to-[#2F8CF0] text-white font-bold text-sm shadow-xl shadow-[#1F7AE0]/30 border border-white/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <RotateCw className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Vérification en cours...' : '🔄 Vérifier l\'activation'}</span>
            </button>

            <button
              onClick={onClose}
              className="tv-focusable w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF4A68] to-[#E5324F] hover:from-[#FF6F88] hover:to-[#FF4A68] text-white font-bold text-sm shadow-xl shadow-[#E5324F]/30 border border-white/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>▶ Accéder au contenu</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
