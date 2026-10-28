import React, { useState } from 'react';
import {
  X,
  DollarSign,
  PlusCircle,
  MinusCircle,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { CashShift, CashMovement } from '../../types';

interface CashArqueoModalProps {
  cashShift: CashShift;
  onClose: () => void;
  onAddMovement: (type: 'INGRESO' | 'EGRESO', amount: number, reason: string) => void;
  onCloseShift: () => void;
}

export const CashArqueoModal: React.FC<CashArqueoModalProps> = ({
  cashShift,
  onClose,
  onAddMovement,
  onCloseShift,
}) => {
  const [activeTab, setActiveTab] = useState<'ARQUEO' | 'MOVIMIENTO' | 'HISTORIAL'>('ARQUEO');

  // Arqueo Denominations (Bolivianos)
  const [counts, setCounts] = useState<{ [denom: number]: number }>({
    200: 0,
    100: 3,
    50: 5,
    20: 8,
    10: 7,
    5: 10,
    2: 12,
    1: 15,
  });

  // New Movement Form
  const [movType, setMovType] = useState<'INGRESO' | 'EGRESO'>('EGRESO');
  const [movAmount, setMovAmount] = useState('');
  const [movReason, setMovReason] = useState('');

  // Calculate counted cash
  const countedTotal = Object.entries(counts).reduce((sum, [denom, count]) => {
    return sum + Number(denom) * (Number(count) || 0);
  }, 0);

  const difference = countedTotal - cashShift.expectedCash;

  const handleDenomChange = (denom: number, val: string) => {
    const num = parseInt(val, 10);
    setCounts((prev) => ({
      ...prev,
      [denom]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(movAmount);
    if (!amount || amount <= 0 || !movReason.trim()) return;

    onAddMovement(movType, amount, movReason.trim());
    setMovAmount('');
    setMovReason('');
    setActiveTab('HISTORIAL');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <DollarSign className="w-5 h-5" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">
                Arqueo de Caja & Movimientos
              </h3>
              <p className="text-[11px] opacity-90">
                Turno #{cashShift.shiftNumber} · Responsable: {cashShift.cashier}
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50 dark:bg-slate-950">
          <button
            onClick={() => setActiveTab('ARQUEO')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'ARQUEO'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Conteo Físico de Billetes
          </button>
          <button
            onClick={() => setActiveTab('MOVIMIENTO')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'MOVIMIENTO'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Registrar Entrada/Salida
          </button>
          <button
            onClick={() => setActiveTab('HISTORIAL')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'HISTORIAL'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Movimientos ({cashShift.movements.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'ARQUEO' && (
            <div className="space-y-5">
              {/* Summary KPIs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Efectivo Esperado
                  </p>
                  <p className="text-base font-black font-mono-numbers text-slate-800 dark:text-slate-100">
                    Bs {cashShift.expectedCash.toFixed(2)}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    Efectivo Contado
                  </p>
                  <p className="text-base font-black font-mono-numbers text-emerald-700 dark:text-emerald-300">
                    Bs {countedTotal.toFixed(2)}
                  </p>
                </div>

                <div
                  className={`p-3 rounded-xl border ${
                    Math.abs(difference) < 0.01
                      ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-700'
                      : difference > 0
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 text-blue-700 dark:text-blue-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase">
                    {difference === 0
                      ? 'Diferencia (Cuadre)'
                      : difference > 0
                      ? 'Sobrante (+)'
                      : 'Faltante (-)'}
                  </p>
                  <p className="text-base font-black font-mono-numbers">
                    {difference > 0 ? '+' : ''}Bs {difference.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Denominations Inputs */}
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                  Desglose de Efectivo (Billetes y Monedas de Bolivia):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[200, 100, 50, 20, 10, 5, 2, 1].map((denom) => (
                    <div
                      key={denom}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                    >
                      <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 font-sans">
                        Bs {denom} {denom >= 10 ? 'Corte' : 'Moneda'}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-xs text-slate-400">x</span>
                        <input
                          type="number"
                          min="0"
                          value={counts[denom]}
                          onChange={(e) => handleDenomChange(denom, e.target.value)}
                          className="w-full text-center font-mono-numbers font-bold text-xs py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-emerald-500"
                        />
                      </div>
                      <span className="text-[10px] font-mono-numbers text-right text-slate-500 mt-1 font-bold">
                        = Bs {(denom * (counts[denom] || 0)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Shift Action */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    ¿Finalizar jornada de caja?
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Generará el reporte Z y registrará el arqueo final.
                  </p>
                </div>
                <button
                  onClick={onCloseShift}
                  className="px-4 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Cierre de Turno Z</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'MOVIMIENTO' && (
            <form onSubmit={handleSaveMovement} className="space-y-4 max-w-md mx-auto py-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMovType('EGRESO')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    movType === 'EGRESO'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Egreso / Salida de Efectivo
                </button>
                <button
                  type="button"
                  onClick={() => setMovType('INGRESO')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    movType === 'INGRESO'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Ingreso Extra de Efectivo
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Monto (Bs):
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={movAmount}
                  onChange={(e) => setMovAmount(e.target.value)}
                  className="w-full text-base font-mono-numbers font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Concepto / Motivo:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pago de delivery de libros, compra de rollos térmicos..."
                  value={movReason}
                  onChange={(e) => setMovReason(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Registrar Movimiento
              </button>
            </form>
          )}

          {activeTab === 'HISTORIAL' && (
            <div className="space-y-2">
              {cashShift.movements.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-8">
                  No hay movimientos registrados en este turno.
                </p>
              ) : (
                cashShift.movements.map((mov) => (
                  <div
                    key={mov.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          mov.type === 'INGRESO'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {mov.type === 'INGRESO' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">
                          {mov.reason}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {mov.timestamp} · {mov.cashier}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-mono-numbers font-extrabold text-sm ${
                        mov.type === 'INGRESO' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {mov.type === 'INGRESO' ? '+' : '-'}Bs {mov.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
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
