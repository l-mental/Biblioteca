import React from 'react';
import {
  Printer,
  X,
  Share2,
  CheckCircle2,
  Download,
  BookOpen,
  QrCode
} from 'lucide-react';
import { Sale } from '../../types';

interface ReceiptModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*COMPROBANTE BIBLIOPLUS*\nTicket: ${sale.id}\nCliente: ${sale.customer.name}\nNIT/CI: ${sale.customer.nitCi}\nTotal: Bs ${sale.total.toFixed(2)}\n¡Gracias por su compra en Librería BiblioPlus!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-4 bg-cyan-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">
                Venta Procesada con Éxito
              </h3>
              <p className="text-[11px] opacity-90">Ticket {sale.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
          <div
            id="printable-receipt"
            className="bg-white text-slate-900 p-5 rounded-xl border border-dashed border-slate-300 shadow-xs text-xs font-mono"
          >
            {/* Header info */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
              <div className="flex items-center justify-center gap-1 font-bold text-sm tracking-widest text-slate-900 font-sans">
                <BookOpen className="w-4 h-4 text-cyan-600" />
                <span>BIBLIOPLUS LIBRERÍA</span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans">
                Librería, Papelería y Servicios Escolares
              </p>
              <p className="text-[10px] text-slate-500">
                Av. Monseñor Rivero #342 · Santa Cruz, Bolivia
              </p>
              <p className="text-[10px] text-slate-500">NIT: 10293847012 · Tel: 3-3345890</p>
              <div className="pt-1">
                <span className="font-bold text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                  FACTURA / RECIBO DE VENTA
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">N° TRANSACCIÓN:</span>
                <span className="font-bold">{sale.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">FECHA Y HORA:</span>
                <span>{sale.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CLIENTE:</span>
                <span className="font-bold truncate max-w-[170px]">{sale.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NIT / CI:</span>
                <span className="font-bold">{sale.customer.nitCi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CAJERO:</span>
                <span>{sale.cashier}</span>
              </div>
            </div>

            {/* Items table */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5">
              <div className="flex justify-between font-bold text-[10px] text-slate-500 pb-1 border-b border-slate-200">
                <span>CANT. / DESCRIPCIÓN</span>
                <span>TOTAL</span>
              </div>
              {sale.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-[11px]">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold truncate">{item.product.title}</p>
                    <p className="text-[10px] text-slate-500">
                      {item.quantity} x Bs {item.product.price.toFixed(2)}
                      {item.discountPercent > 0 && ` (-${item.discountPercent}%)`}
                    </p>
                  </div>
                  <span className="font-bold shrink-0">
                    Bs {(item.product.price * item.quantity * (1 - item.discountPercent / 100)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">SUBTOTAL:</span>
                <span>Bs {sale.subtotal.toFixed(2)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>DESCUENTO:</span>
                  <span>-Bs {sale.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black pt-1">
                <span>TOTAL A PAGAR:</span>
                <span>Bs {sale.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[10px] pt-1">
                <span>MÉTODO DE PAGO:</span>
                <span className="font-bold uppercase">{sale.paymentMethod}</span>
              </div>
              {sale.cashTendered && sale.cashTendered > 0 && (
                <>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>EFECTIVO ENTREGADO:</span>
                    <span>Bs {sale.cashTendered.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-700 font-bold">
                    <span>CAMBIO:</span>
                    <span>Bs {(sale.change || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* QR simulation & SIN Authorization */}
            <div className="pt-3 text-center space-y-2">
              <div className="w-24 h-24 mx-auto bg-slate-100 p-1.5 rounded-lg flex items-center justify-center border border-slate-200">
                <QrCode className="w-20 h-20 text-slate-800" />
              </div>
              <p className="text-[9px] text-slate-400 font-sans leading-tight">
                CÓDIGO DE CONTROL: 8B-F2-3C-9A-01<br />
                AUTORIZACIÓN N°: 3948019002931<br />
                "ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS"
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs uppercase flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ticket</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            title="Enviar Comprobante por WhatsApp"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
