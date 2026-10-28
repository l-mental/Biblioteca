import React from 'react';
import {
  FileText,
  DollarSign,
  Calendar,
  Moon,
  Sun,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { CashShift } from '../types';

interface HeaderBarProps {
  cashShift: CashShift;
  quotesCount: number;
  onOpenQuotes: () => void;
  onOpenCashArqueo: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  cashShift,
  quotesCount,
  onOpenQuotes,
  onOpenCashArqueo,
  isDarkMode,
  onToggleDarkMode,
}) => {
  // Format current date in Spanish, matching screenshot e.g. "miércoles, 28 de octubre"
  const formattedDate = new Intl.DateTimeFormat('es-BO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 transition-colors">
      {/* Turno de Caja Box - Matching Screenshot Exactly */}
      <div className="flex items-center gap-6 flex-1 max-w-4xl">
        <div className="flex items-center gap-3 py-2 px-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              TURNO DE CAJA #{cashShift.shiftNumber} ACTIVO
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
              Efectivo Esperado en Caja:{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-mono-numbers font-extrabold text-sm">
                Bs {cashShift.expectedCash.toFixed(2)}
              </span>
            </span>
          </div>
        </div>

        {/* Action Buttons: Proformas and Arqueo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenQuotes}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-200/60 dark:border-cyan-800/60 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Proformas / Cotizaciones</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-200 dark:bg-cyan-800 text-cyan-900 dark:text-cyan-100 text-[10px] font-black">
              {quotesCount}
            </span>
          </button>

          <button
            onClick={onOpenCashArqueo}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Arqueo / Movimientos</span>
          </button>
        </div>
      </div>

      {/* Right side: Date, Location, and Theme Toggles */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden lg:block">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 capitalize">
            {formattedDate}
          </p>
          <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-cyan-500" />
            <span>SANTA CRUZ, BOLIVIA</span>
          </div>
        </div>

        <button
          title="Calendario"
          className="w-9 h-9 rounded-xl border border-cyan-200 dark:border-cyan-800/80 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
