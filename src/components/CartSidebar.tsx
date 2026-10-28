import React, { useState } from 'react';
import {
  ShoppingCart,
  User,
  Trash2,
  Plus,
  Minus,
  QrCode,
  CreditCard,
  Banknote,
  Receipt,
  RotateCcw,
  Tag,
  ArrowRight
} from 'lucide-react';
import { CartItem, Customer, PaymentMethod } from '../types';

interface CartSidebarProps {
  cart: CartItem[];
  customer: Customer;
  paymentMethod: PaymentMethod;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onChangeCustomer: () => void;
  onSetPaymentMethod: (method: PaymentMethod) => void;
  onCheckout: (tenderedAmount?: number) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  customer,
  paymentMethod,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onChangeCustomer,
  onSetPaymentMethod,
  onCheckout,
}) => {
  const [cashTendered, setCashTendered] = useState<string>('');
  const [withInvoice, setWithInvoice] = useState<boolean>(true);

  // Calculations
  const rawSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.price;
    const discount = (itemPrice * item.discountPercent) / 100;
    return sum + (itemPrice - discount) * item.quantity;
  }, 0);

  // Customer loyalty discount if applicable
  const customerDiscount = customer.discountRate
    ? (rawSubtotal * customer.discountRate) / 100
    : 0;

  const total = Math.max(0, rawSubtotal - customerDiscount);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cash change calculation
  const tenderedNum = parseFloat(cashTendered) || 0;
  const change = Math.max(0, tenderedNum - total);

  const handleQuickCash = (amount: number) => {
    setCashTendered(amount.toString());
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'EFECTIVO' && tenderedNum > 0) {
      onCheckout(tenderedNum);
    } else {
      onCheckout(total);
    }
  };

  return (
    <div className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 h-full select-none transition-colors shadow-lg">
      {/* Top Header matching screenshot */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white shadow-sm shadow-cyan-500/30">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold italic text-sm tracking-wider uppercase text-slate-900 dark:text-white">
                Terminal POS
              </h2>
              <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
                {totalItemsCount} {totalItemsCount === 1 ? 'ÍTEM' : 'ÍTEMS'} EN ORDEN
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <button
              onClick={onClearCart}
              title="Vaciar orden actual"
              className="px-2.5 py-1 text-[11px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors uppercase"
            >
              Vaciar
            </button>
          )}
        </div>

        {/* Customer Box matching screenshot */}
        <div className="mt-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
            Identidad de Cliente y Fidelización
          </p>
          <div
            onClick={onChangeCustomer}
            className="flex items-center justify-between p-2.5 rounded-xl border border-cyan-200/80 dark:border-cyan-900/60 bg-cyan-50/40 dark:bg-cyan-950/20 hover:border-cyan-400 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate uppercase">
                  {customer.name}
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  NIT/CI: <span className="font-mono-numbers">{customer.nitCi}</span>
                  {customer.points > 0 && ` · ${customer.points} pts`}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 shrink-0 ml-2">
              Cambiar
            </span>
          </div>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <ShoppingCart className="w-8 h-8 stroke-1" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Terminal Vacío
            </p>
            <p className="text-[11px] mt-1 max-w-[200px]">
              Haz clic en cualquier libro o artículo del catálogo para añadirlo al ticket.
            </p>
          </div>
        ) : (
          cart.map((item) => {
            const itemPrice = item.product.price;
            const lineTotal = itemPrice * item.quantity;

            return (
              <div
                key={item.product.id}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-white shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                        <Tag className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate uppercase leading-tight">
                        {item.product.title}
                      </p>
                      <p className="text-[10px] font-mono-numbers text-slate-400 mt-0.5">
                        Bs {itemPrice.toFixed(2)} c/u
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quantity steppers and line subtotal */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 overflow-hidden">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600 font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2.5 py-0.5 text-xs font-bold font-mono-numbers text-slate-800 dark:text-slate-100 min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600 font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black font-mono-numbers text-slate-900 dark:text-white">
                      Bs {lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Financials & Checkout Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
        {/* Subtotal & Discount row */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-slate-500 font-semibold uppercase text-[11px]">
            <span>Subtotal</span>
            <span className="font-mono-numbers font-bold">Bs {rawSubtotal.toFixed(2)}</span>
          </div>

          {customerDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold text-[11px]">
              <span>Descuento Cliente ({customer.discountRate}%)</span>
              <span className="font-mono-numbers font-bold">-Bs {customerDiscount.toFixed(2)}</span>
            </div>
          )}

          {/* Factura toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Factura Electrónica
            </span>
            <button
              onClick={() => setWithInvoice(!withInvoice)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                withInvoice
                  ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-700'
              }`}
            >
              {withInvoice ? 'CON FACTURA' : 'RECIBO SIMPLE'}
            </button>
          </div>
        </div>

        {/* Neto Total matching screenshot */}
        <div className="flex items-baseline justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-black tracking-widest uppercase text-slate-900 dark:text-white">
            Neto Total
          </span>
          <div className="text-2xl font-black text-cyan-500 dark:text-cyan-400 font-sans tracking-tight">
            <span className="text-sm mr-1">Bs</span>
            {total.toFixed(2)}
          </div>
        </div>

        {/* Payment Methods buttons matching screenshot */}
        <div className="grid grid-cols-3 gap-2">
          {/* EFECTIVO */}
          <button
            onClick={() => onSetPaymentMethod('EFECTIVO')}
            className={`py-2 px-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              paymentMethod === 'EFECTIVO'
                ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30 ring-1 ring-cyan-400'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Efectivo</span>
          </button>

          {/* PAGO QR */}
          <button
            onClick={() => onSetPaymentMethod('PAGO QR')}
            className={`py-2 px-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              paymentMethod === 'PAGO QR'
                ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30 ring-1 ring-cyan-400'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Pago QR</span>
          </button>

          {/* TARJETA / MIXTO */}
          <button
            onClick={() => onSetPaymentMethod('MIXTO')}
            className={`py-2 px-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              paymentMethod === 'MIXTO'
                ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30 ring-1 ring-cyan-400'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Mixto / Tarjeta</span>
          </button>
        </div>

        {/* Cash Tendered & Change calculator (if Cash is active) */}
        {paymentMethod === 'EFECTIVO' && cart.length > 0 && (
          <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300 text-[11px] uppercase">
                Monto Recibido:
              </span>
              <div className="relative w-28">
                <span className="absolute left-2 top-1 text-[11px] font-bold text-slate-400">Bs</span>
                <input
                  type="number"
                  step="any"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  placeholder={total.toFixed(2)}
                  className="w-full text-right font-mono-numbers font-bold text-xs pl-7 pr-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Quick cash denomination chips */}
            <div className="flex items-center gap-1 justify-between">
              <button
                onClick={() => handleQuickCash(total)}
                className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded hover:bg-cyan-50"
              >
                Exacto
              </button>
              <button
                onClick={() => handleQuickCash(50)}
                className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded hover:bg-cyan-50"
              >
                Bs 50
              </button>
              <button
                onClick={() => handleQuickCash(100)}
                className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded hover:bg-cyan-50"
              >
                Bs 100
              </button>
              <button
                onClick={() => handleQuickCash(200)}
                className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded hover:bg-cyan-50"
              >
                Bs 200
              </button>
            </div>

            {/* Calculated Change */}
            {tenderedNum > 0 && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700">
                <span className="font-extrabold text-emerald-600 uppercase text-[11px]">
                  Cambio a Entregar:
                </span>
                <span className="font-mono-numbers font-black text-sm text-emerald-600">
                  Bs {change.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Big Action Button matching screenshot: EJECUTAR VENTA */}
        <button
          onClick={handleCheckoutClick}
          disabled={cart.length === 0}
          className={`w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
            cart.length > 0
              ? 'bg-cyan-400 hover:bg-cyan-500 text-white shadow-md shadow-cyan-400/30 active:scale-[0.99]'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Ejecutar Venta</span>
        </button>
      </div>
    </div>
  );
};
