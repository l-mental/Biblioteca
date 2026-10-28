import React from 'react';
import {
  FileText,
  X,
  ArrowRight,
  Printer,
  Calendar,
  User,
  Plus
} from 'lucide-react';
import { Quote } from '../../types';

interface QuotesModalProps {
  quotes: Quote[];
  onClose: () => void;
  onLoadQuoteIntoCart: (quote: Quote) => void;
  onCreateQuoteFromCart: () => void;
  canCreateFromCart: boolean;
}

export const QuotesModal: React.FC<QuotesModalProps> = ({
  quotes,
  onClose,
  onLoadQuoteIntoCart,
  onCreateQuoteFromCart,
  canCreateFromCart,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">
                Proformas & Cotizaciones
              </h3>
              <p className="text-[11px] opacity-90">
                Listas escolares, pedidos institucionales y presupuestos
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950">
          {canCreateFromCart && (
            <div className="p-3.5 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl border border-cyan-200 dark:border-cyan-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-cyan-950 dark:text-cyan-200 uppercase">
                  Guardar Carrito Actual como Proforma
                </p>
                <p className="text-[11px] text-cyan-700 dark:text-cyan-400">
                  Ideal para entregar presupuestos a colegios o empresas.
                </p>
              </div>
              <button
                onClick={onCreateQuoteFromCart}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs uppercase flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Guardar Proforma</span>
              </button>
            </div>
          )}

          <div className="space-y-3">
            {quotes.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto stroke-1 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  No hay cotizaciones activas
                </p>
                <p className="text-[11px] mt-1">
                  Agrega libros o útiles al carrito y guárdalos como proforma.
                </p>
              </div>
            ) : (
              quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-cyan-600 dark:text-cyan-400">
                          {quote.id}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold">
                          Vence: {quote.validUntil}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase mt-1">
                        {quote.customer.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        NIT: {quote.customer.nitCi} · Fecha: {quote.date}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Total Cotizado</span>
                      <p className="text-base font-black font-mono-numbers text-slate-900 dark:text-white">
                        Bs {quote.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Items list preview */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5 text-xs space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Artículos incluidos ({quote.items.length}):
                    </p>
                    {quote.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="truncate max-w-[320px] text-slate-700 dark:text-slate-300">
                          {item.quantity}x {item.product.title}
                        </span>
                        <span className="font-mono-numbers text-slate-500 font-medium">
                          Bs {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {quote.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      Nota: "{quote.notes}"
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onLoadQuoteIntoCart(quote)}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-extrabold uppercase flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <span>Cargar a Venta Directa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
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
