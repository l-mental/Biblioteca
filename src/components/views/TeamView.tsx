import React from 'react';
import {
  ShieldAlert,
  UserCheck,
  Clock,
  Key,
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import { CashShift } from '../../types';

interface TeamViewProps {
  cashShift: CashShift;
  onSwitchCashier: (name: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  cashShift,
  onSwitchCashier,
}) => {
  const staffMembers = [
    {
      id: 'staff-1',
      name: 'ADMINISTRADOR SISTEMA',
      role: 'ADMINISTRADOR GENERAL',
      shift: 'Turno Mañana (08:00 - 14:00)',
      active: cashShift.cashier === 'ADMINISTRADOR SISTEMA',
    },
    {
      id: 'staff-2',
      name: 'LUCÍA VARGAS (CAJERO 2)',
      role: 'CAJERO DE MOSTRADOR',
      shift: 'Turno Tarde (14:00 - 20:30)',
      active: cashShift.cashier === 'LUCÍA VARGAS (CAJERO 2)',
    },
    {
      id: 'staff-3',
      name: 'MARCO A. FLORES (ENCARGADO)',
      role: 'SUPERVISOR DE INVENTARIO',
      shift: 'Turno Completo',
      active: cashShift.cashier === 'MARCO A. FLORES (ENCARGADO)',
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950">
      <div>
        <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-500" />
          <span>Equipo de Trabajo & Control de Turnos</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Gestión de cajeros de librería, permisos de anulación y asignación de turno.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-2xs space-y-4 flex flex-col justify-between ${
              staff.active
                ? 'border-cyan-400 ring-2 ring-cyan-400/20'
                : 'border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-base">
                  {staff.name.charAt(0)}
                </div>
                {staff.active ? (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                    <UserCheck className="w-3 h-3" />
                    En Caja Activa
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Disponible
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h3 className="font-black text-xs text-slate-900 dark:text-slate-100 uppercase">
                  {staff.name}
                </h3>
                <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">
                  {staff.role}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                  <Clock className="w-3 h-3" />
                  <span>{staff.shift}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              {!staff.active ? (
                <button
                  onClick={() => onSwitchCashier(staff.name)}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-200 hover:text-cyan-600 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Asignar a Caja</span>
                </button>
              ) : (
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase">
                  Cajero actual en sesión
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
