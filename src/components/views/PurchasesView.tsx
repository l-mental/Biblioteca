import React, { useState } from 'react';
import {
  Truck,
  Plus,
  PackageCheck,
  Clock,
  Building2,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface PurchaseOrder {
  id: string;
  supplier: string;
  contact: string;
  date: string;
  itemsSummary: string;
  total: number;
  status: 'RECIBIDO' | 'EN CAMINO' | 'PENDIENTE';
}

export const PurchasesView: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PED-1092',
      supplier: 'EDITORIAL PLANETA BOLIVIA',
      contact: 'pedidos@planeta.com.bo',
      date: '27/10/2026',
      itemsSummary: '40 Novelas Bestsellers, 25 Novelas Juveniles',
      total: 3450.0,
      status: 'RECIBIDO',
    },
    {
      id: 'PED-1093',
      supplier: 'FABER-CASTELL DISTRIBUIDORA',
      contact: 'ventas@faber-castell.bo',
      date: '28/10/2026',
      itemsSummary: '150 Cajas de lápices de color, 80 marcadores acuarelables',
      total: 2180.0,
      status: 'EN CAMINO',
    },
    {
      id: 'PED-1094',
      supplier: 'PAPELERA CHAMEX / SYLVAMO',
      contact: 'distribucion@chamex.bo',
      date: '28/10/2026',
      itemsSummary: '200 Resmas de papel bond 75g A4 y Oficio',
      total: 5600.0,
      status: 'PENDIENTE',
    },
    {
      id: 'PED-1095',
      supplier: 'SANTILLANA TEXTOS ESCOLARES',
      contact: 'escolar@santillana.com.bo',
      date: '25/10/2026',
      itemsSummary: '60 Diccionarios y textos de matemáticas y lenguaje',
      total: 4200.0,
      status: 'RECIBIDO',
    }
  ]);

  const handleMarkReceived = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'RECIBIDO' } : o))
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-500" />
            <span>Compras & Pedidos a Editoriales / Proveedores</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gestión de abastecimiento, consignaciones y recepción de mercadería.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-extrabold text-sm text-cyan-600 dark:text-cyan-400">
                    {order.id}
                  </span>
                  <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase mt-0.5">
                    {order.supplier}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {order.contact} · Fecha: {order.date}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    order.status === 'RECIBIDO'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : order.status === 'EN CAMINO'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">
                  Artículos pedidos:
                </span>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {order.itemsSummary}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Factura:</span>
                <p className="font-mono-numbers font-black text-slate-900 dark:text-white text-base">
                  Bs {order.total.toFixed(2)}
                </p>
              </div>

              {order.status !== 'RECIBIDO' && (
                <button
                  onClick={() => handleMarkReceived(order.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Marcar Recibido</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
