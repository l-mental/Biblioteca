import React from 'react';
import {
  BarChart3,
  DollarSign,
  QrCode,
  CreditCard,
  Banknote,
  TrendingUp,
  Percent,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { Sale, CashShift } from '../../types';

interface FinancesViewProps {
  sales: Sale[];
  cashShift: CashShift;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  sales,
  cashShift,
}) => {
  const completedSales = sales.filter((s) => s.status === 'COMPLETADA');
  const totalRevenue = completedSales.reduce((sum, s) => sum + s.total, 0);

  // Approximate cost of goods sold
  const totalCost = completedSales.reduce((sum, s) => {
    return (
      sum +
      s.items.reduce((itemSum, item) => {
        return itemSum + item.product.costPrice * item.quantity;
      }, 0)
    );
  }, 0);

  const estimatedProfit = Math.max(0, totalRevenue - totalCost);
  const profitMarginPercent = totalRevenue > 0 ? (estimatedProfit / totalRevenue) * 100 : 0;

  // Breakdown by payment method
  const cashSales = completedSales
    .filter((s) => s.paymentMethod === 'EFECTIVO')
    .reduce((sum, s) => sum + s.total, 0);

  const qrSales = completedSales
    .filter((s) => s.paymentMethod === 'PAGO QR')
    .reduce((sum, s) => sum + s.total, 0);

  const cardSales = completedSales
    .filter((s) => s.paymentMethod === 'TARJETA' || s.paymentMethod === 'MIXTO')
    .reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950">
      <div>
        <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-500" />
          <span>Finanzas & Rendimiento de Librería</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Ingresos brutos, margen comercial estimado y conciliación de canales de cobro.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Ingresos Totales (Venta Neta)
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-sans text-slate-900 dark:text-white mt-2">
            <span className="text-sm font-bold text-slate-400 mr-1">Bs</span>
            {totalRevenue.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Basado en {completedSales.length} comprobantes válidos
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Margen Bruto Estimado
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-sans text-emerald-600 dark:text-emerald-400 mt-2">
            <span className="text-sm font-bold text-slate-400 mr-1">Bs</span>
            {estimatedProfit.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Margen de ganancia aproximado: {profitMarginPercent.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Fondo en Caja Registradora
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono-numbers text-slate-900 dark:text-white mt-2">
            <span className="text-sm font-bold text-slate-400 mr-1">Bs</span>
            {cashShift.expectedCash.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Efectivo físico estimado según arqueo
          </p>
        </div>
      </div>

      {/* Payment Channels Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cash Channel */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              Efectivo en Caja
            </span>
            <p className="text-lg font-black font-mono-numbers text-slate-900 dark:text-white">
              Bs {cashSales.toFixed(2)}
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${totalRevenue > 0 ? (cashSales / totalRevenue) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* QR Channel */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              Pagos Simple QR
            </span>
            <p className="text-lg font-black font-mono-numbers text-slate-900 dark:text-white">
              Bs {qrSales.toFixed(2)}
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full"
                style={{ width: `${totalRevenue > 0 ? (qrSales / totalRevenue) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cards / Mixed Channel */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              Tarjetas & Terminal POS
            </span>
            <p className="text-lg font-black font-mono-numbers text-slate-900 dark:text-white">
              Bs {cardSales.toFixed(2)}
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${totalRevenue > 0 ? (cardSales / totalRevenue) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
