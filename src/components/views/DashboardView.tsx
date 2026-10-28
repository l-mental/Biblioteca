import React from 'react';
import {
  TrendingUp,
  Receipt,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Product, Sale, CashShift } from '../../types';

interface DashboardViewProps {
  products: Product[];
  sales: Sale[];
  cashShift: CashShift;
  onGoToPos: () => void;
  onSelectCategoryFilter?: (cat: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  sales,
  cashShift,
  onGoToPos,
}) => {
  const totalSalesToday = sales.reduce((sum, s) => sum + s.total, 0);
  const totalTicketsToday = sales.length;
  const averageTicket = totalTicketsToday > 0 ? totalSalesToday / totalTicketsToday : 0;
  const lowStockItems = products.filter(
    (p) => !p.isService && p.stock <= p.minStock
  );

  // Group sales by category
  const categorySalesMap: { [key: string]: number } = {};
  sales.forEach((s) => {
    s.items.forEach((item) => {
      const cat = item.product.category;
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + item.product.price * item.quantity;
    });
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950">
      {/* Welcome & Quick CTA banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-cyan-500/20">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
            Panel de Control · Librería & Papelería
          </span>
          <h1 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
            Gestión Inteligente BiblioPlus
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Resumen diario de ventas de literatura, textos escolares, papelería y servicios de mostrador.
          </p>
        </div>

        <button
          onClick={onGoToPos}
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer shrink-0"
        >
          <span>Abrir Terminal de Venta</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Ventas Totales Hoy
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-sans text-slate-900 dark:text-white mt-2">
            <span className="text-sm font-bold text-slate-400 mr-1">Bs</span>
            {totalSalesToday.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Turno de Caja #{cashShift.shiftNumber} en curso
          </p>
        </div>

        {/* Tickets Issued */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Comprobantes Emitidos
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono-numbers text-slate-900 dark:text-white mt-2">
            {totalTicketsToday}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Facturas y recibos completados
          </p>
        </div>

        {/* Average Ticket */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Ticket Promedio
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-sans text-slate-900 dark:text-white mt-2">
            <span className="text-sm font-bold text-slate-400 mr-1">Bs</span>
            {averageTicket.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Gasto medio por cliente
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Alertas de Stock Bajo
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                lowStockItems.length > 0
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                  : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono-numbers text-slate-900 dark:text-white mt-2">
            {lowStockItems.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {lowStockItems.length === 0 ? 'Inventario óptimo' : 'Artículos por reponer'}
          </p>
        </div>
      </div>

      {/* Middle Grid: Top Products and Low Stock Warning list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock alerts list */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Inventario con Nivel Crítico / Stock Mínimo
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              {lowStockItems.length} por reponer
            </span>
          </div>

          <div className="space-y-2">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Todos los libros y útiles se encuentran por encima del umbral mínimo de stock.
              </p>
            ) : (
              lowStockItems.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-extrabold text-slate-900 dark:text-slate-100 truncate uppercase">
                      {prod.title}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {prod.category} · Ubicación: {prod.location || 'Exhibidor Principal'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase block">
                      Quedan {prod.stock} un.
                    </span>
                    <span className="text-[9px] text-slate-400">
                      Mínimo requerido: {prod.minStock}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Featured Bookstore Catalog Highlights */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Artículos Destacados en Catálogo
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {products.length} Referencias
            </span>
          </div>

          <div className="space-y-2">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-white shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900 dark:text-slate-100 truncate uppercase">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {p.author || p.editorial || p.category}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono-numbers font-black text-slate-900 dark:text-white text-xs">
                    Bs {p.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-bold">
                    Stock: {p.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
