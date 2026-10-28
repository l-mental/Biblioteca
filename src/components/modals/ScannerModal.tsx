import React, { useState } from 'react';
import {
  Barcode,
  X,
  ScanLine,
  Volume2,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Product } from '../../types';

interface ScannerModalProps {
  products: Product[];
  onClose: () => void;
  onScanProduct: (product: Product) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  products,
  onClose,
  onScanProduct,
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synthesize realistic scanner beep sound using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, audioCtx.currentTime); // 1.8kHz crisp POS beep
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {
      // AudioContext fallback
    }
  };

  const handleSimulateScan = (product: Product) => {
    playBeep();
    onScanProduct(product);
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = barcodeInput.trim();
    if (!cleanCode) return;

    const matched = products.find(
      (p) => p.sku.toLowerCase() === cleanCode.toLowerCase()
    );

    if (matched) {
      playBeep();
      onScanProduct(matched);
      onClose();
    } else {
      setErrorMsg(`No se encontró ningún artículo con el código o ISBN "${cleanCode}"`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Barcode className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">
                Lector de Código de Barras & ISBN
              </h3>
              <p className="text-[11px] text-slate-400">
                Pistola láser óptica o ingreso manual rápido
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-slate-50 dark:bg-slate-950">
          {/* Laser Scanner animation viewport */}
          <div className="relative h-32 bg-slate-900 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-cyan-500/60 overflow-hidden">
            <div className="absolute inset-x-0 h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-bounce" />
            <ScanLine className="w-10 h-10 text-cyan-400/80 mb-1" />
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Listo para escanear
            </p>
            <p className="text-[10px] text-slate-500">
              Apunta el lector láser al código de barras del libro o cuaderno
            </p>
          </div>

          {/* Manual Input form */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Ingresar Código de Barras o ISBN:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={barcodeInput}
                onChange={(e) => {
                  setBarcodeInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Ej: 9780307474728 o 777010000003..."
                className="flex-1 font-mono-numbers text-xs font-bold px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-extrabold uppercase shadow-xs transition-all cursor-pointer"
              >
                Buscar
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-500 font-semibold">{errorMsg}</p>
            )}
          </form>

          {/* Quick-test barcode buttons */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase mb-2">
              Códigos de prueba directa del catálogo:
            </p>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {products.slice(0, 5).map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleSimulateScan(prod)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 flex items-center justify-between text-xs transition-all cursor-pointer text-left"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate uppercase">
                      {prod.title}
                    </p>
                    <span className="font-mono-numbers text-[10px] text-slate-400 font-bold">
                      {prod.sku}
                    </span>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-[10px] font-black uppercase">
                    Escanear
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
