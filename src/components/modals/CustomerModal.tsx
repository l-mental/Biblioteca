import React, { useState } from 'react';
import {
  User,
  X,
  Search,
  UserPlus,
  Check,
  Building,
  Phone,
  Mail,
  Award
} from 'lucide-react';
import { Customer } from '../../types';

interface CustomerModalProps {
  customers: Customer[];
  selectedCustomerId: string;
  onClose: () => void;
  onSelectCustomer: (customer: Customer) => void;
  onAddNewCustomer: (customer: Customer) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  customers,
  selectedCustomerId,
  onClose,
  onSelectCustomer,
  onAddNewCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New customer inputs
  const [name, setName] = useState('');
  const [nitCi, setNitCi] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [discountRate, setDiscountRate] = useState<number>(0);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nitCi.includes(searchTerm)
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nitCi.trim()) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: name.trim().toUpperCase(),
      nitCi: nitCi.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      points: 10, // 10 welcome points
      discountRate: discountRate > 0 ? discountRate : undefined,
    };

    onAddNewCustomer(newCust);
    onSelectCustomer(newCust);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">
                Selección de Cliente & Facturación
              </h3>
              <p className="text-[11px] opacity-90">
                NIT / CI para Emisión de Facturas y Puntos de Fidelidad
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 dark:bg-slate-950">
          {!showAddForm ? (
            <>
              {/* Search & Add New button */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o número de NIT/CI..."
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Nuevo Cliente</span>
                </button>
              </div>

              {/* Customer List */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredCustomers.map((c) => {
                  const isSelected = c.id === selectedCustomerId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelectCustomer(c)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-400 dark:border-cyan-600'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-cyan-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-cyan-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate uppercase">
                            {c.name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span>NIT/CI: <strong className="font-mono-numbers">{c.nitCi}</strong></span>
                            {c.phone && <span>· {c.phone}</span>}
                            {c.points > 0 && (
                              <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                                <Award className="w-2.5 h-2.5" /> {c.points} pts
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Add Customer Form */
            <form onSubmit={handleCreateCustomer} className="space-y-3.5 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-100">
                  Registrar Nuevo Cliente
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Volver a la lista
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Nombre Completo o Razón Social *:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Colegio Alemán, Arq. Juan Pérez..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Número de NIT / CI *:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 8492019 o 1029384"
                    value={nitCi}
                    onChange={(e) => setNitCi(e.target.value)}
                    className="w-full text-xs font-mono-numbers font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Celular / WhatsApp:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 77012345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Correo Electrónico:
                  </label>
                  <input
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    % Descuento Preferencial:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    placeholder="0"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500 font-mono-numbers"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-extrabold uppercase shadow-xs transition-all cursor-pointer"
                >
                  Guardar y Seleccionar
                </button>
              </div>
            </form>
          )}
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
