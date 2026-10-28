import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Award,
  Phone,
  Mail,
  Building,
  CreditCard
} from 'lucide-react';
import { Customer } from '../../types';

interface CustomersViewProps {
  customers: Customer[];
  onAddNewCustomer: (customer: Customer) => void;
  onOpenCustomerModal: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onOpenCustomerModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nitCi.includes(searchTerm)
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-500" />
            <span>Base de Clientes & Puntos de Fidelidad</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registro de clientes particulares, colegios, universidades y empresas (NIT/CI).
          </p>
        </div>

        <button
          onClick={onOpenCustomerModal}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registrar Cliente</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente por razón social o NIT/CI..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {c.name.charAt(0)}
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                  <Award className="w-3 h-3" />
                  <span>{c.points} Puntos</span>
                </span>
              </div>

              <div className="mt-2.5">
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase line-clamp-2">
                  {c.name}
                </h3>
                <p className="text-[11px] font-mono-numbers font-bold text-slate-500 mt-1">
                  NIT / CI: {c.nitCi}
                </p>
              </div>

              <div className="mt-3 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                {c.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{c.phone}</span>
                  </div>
                )}
                {c.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{c.email}</span>
                  </div>
                )}
              </div>
            </div>

            {c.discountRate && c.discountRate > 0 ? (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold text-cyan-600">
                <span>Descuento preferencial:</span>
                <span>{c.discountRate}% aplicado en POS</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
