import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Printer,
  Ban,
  CheckCircle2,
  Calendar,
  User,
  ArrowUpDown
} from 'lucide-react';
import { Sale } from '../../types';

interface SalesHistoryViewProps {
  sales: Sale[];
  onReprintReceipt: (sale: Sale) => void;
  onCancelSale: (saleId: string) => void;
}

export const SalesHistoryView: React.FC<SalesHistoryViewProps> = ({
  sales,
  onReprintReceipt,
  onCancelSale,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'COMPLETADA' | 'ANULADA'>('TODOS');

  const filteredSales = sales.filter((s) => {
    const matchStatus = statusFilter === 'TODOS' || s.status === statusFilter;
    const q = searchTerm.toLowerCase().trim();
    if (!q) return matchStatus;

    const matchSearch =
      s.id.toLowerCase().includes(q) ||
      s.customer.name.toLowerCase().includes(q) ||
      s.customer.nitCi.includes(q) ||
      s.paymentMethod.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-cyan-500" />
            <span>Historial de Ventas & Facturación</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registro de comprobantes fiscales, reimpresión de tickets y anulaciones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            Total Registros: <strong className="text-slate-900 dark:text-white">{sales.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por N° ticket, cliente, NIT/CI o forma de pago..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'TODOS' | 'COMPLETADA' | 'ANULADA')}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="COMPLETADA">Solo Completadas</option>
            <option value="ANULADA">Solo Anuladas</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">N° Ticket</th>
                <th className="py-3 px-3">Fecha y Hora</th>
                <th className="py-3 px-3">Cliente / Razón Social</th>
                <th className="py-3 px-3">NIT / CI</th>
                <th className="py-3 px-3">Forma de Pago</th>
                <th className="py-3 px-3 text-right">Total (Bs)</th>
                <th className="py-3 px-3 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No se encontraron transacciones en el historial.
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono-numbers font-bold text-cyan-600 dark:text-cyan-400">
                      {s.id}
                    </td>

                    <td className="py-3 px-3 text-[11px] text-slate-500">
                      {s.date}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 dark:text-slate-100 uppercase truncate max-w-[180px] block">
                        {s.customer.name}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono-numbers text-slate-500">
                      {s.customer.nitCi}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                        {s.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono-numbers font-black text-slate-900 dark:text-white">
                      Bs {s.total.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          s.status === 'COMPLETADA'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onReprintReceipt(s)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition-colors cursor-pointer"
                          title="Reimprimir Comprobante"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {s.status === 'COMPLETADA' && (
                          <button
                            onClick={() => onCancelSale(s.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Anular Venta"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
