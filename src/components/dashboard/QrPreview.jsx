import React from 'react';
import useAuth from '../../hooks/useAuth';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';
import { Download, QrCode, ExternalLink } from 'lucide-react';

export const QrPreview = () => {
  const { vehicle } = useAuth();

  const handleDownload = () => {
    if (!vehicle?.qrCodeImage) return;
    
    const link = document.createElement('a');
    link.href = vehicle.qrCodeImage;
    link.download = `connectqr-${vehicle.vehicleNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!vehicle) return null;

  return (
    <GlassCard className="flex flex-col items-center gap-6 justify-between h-full">
      <div className="w-full flex items-center gap-3 border-b border-slate-800 pb-4">
        <span className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
          <QrCode className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-white">Vehicle QR Code</h3>
          <p className="text-xs text-slate-500 truncate">Print and place this QR on your windshield</p>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="relative group p-4 bg-white rounded-2xl border border-slate-200 shadow-glass-glow flex items-center justify-center max-w-[220px] w-full aspect-square">
        <img
          src={vehicle.qrCodeImage}
          alt="Vehicle QR Code"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-all duration-300 gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-1.5 shadow-none"
          >
            <Download className="h-4 w-4" />
            Save PNG
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        {/* Public Routing Preview Link */}
        <div className="bg-slate-900/60 border border-slate-800/85 rounded-xl p-3 text-xs flex flex-col gap-1.5">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Gateway Scan Link</span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-slate-400 truncate text-[11px] flex-1">
              {vehicle.qrCodeUrl}
            </span>
            <a
              href={vehicle.qrCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 hover:bg-slate-800/50 p-1 rounded-lg transition-colors flex-shrink-0"
              title="Open public scanning interface"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="secondary"
          className="w-full flex items-center gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Download Print-Ready PNG
        </Button>
      </div>
    </GlassCard>
  );
};
export default QrPreview;
