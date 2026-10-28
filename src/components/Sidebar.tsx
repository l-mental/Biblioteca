import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Boxes,
  ChevronDown,
  Receipt,
  BarChart3,
  Users,
  ShieldAlert,
  LogOut,
  BookOpen
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  inventorySubmenuOpen: boolean;
  onToggleInventorySubmenu: () => void;
  onLogout: () => void;
  cashierName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  inventorySubmenuOpen,
  onToggleInventorySubmenu,
  onLogout,
  cashierName,
}) => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 select-none transition-colors">
      {/* Top Branding */}
      <div>
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-100 dark:border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white shadow-sm shadow-cyan-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-base tracking-wider text-slate-900 dark:text-white uppercase font-sans">
                BIBLIO<span className="text-cyan-500">PLUS</span>
              </span>
            </div>
            <p className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase">
              INTELLIGENCE POS
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {/* TABLERO */}
          <button
            onClick={() => onSelectTab('TABLERO')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              currentTab === 'TABLERO'
                ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span className="truncate">Tablero Principal</span>
          </button>

          {/* VENTA DIRECTA (Primary POS) */}
          <button
            onClick={() => onSelectTab('VENTA_DIRECTA')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              currentTab === 'VENTA_DIRECTA'
                ? 'bg-cyan-100/70 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4 shrink-0 text-cyan-500" />
              <span className="truncate">Venta Directa</span>
            </div>
            <span className="text-cyan-500 font-bold text-sm">›</span>
          </button>

          {/* COMPRAS */}
          <button
            onClick={() => onSelectTab('COMPRAS')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              currentTab === 'COMPRAS'
                ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4 shrink-0" />
            <span className="truncate">Compras / Pedidos</span>
          </button>

          {/* INVENTARIO with submenu */}
          <div>
            <button
              onClick={() => {
                onToggleInventorySubmenu();
                if (currentTab !== 'INVENTARIO') {
                  onSelectTab('INVENTARIO');
                }
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                currentTab === 'INVENTARIO'
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Boxes className="w-4 h-4 shrink-0" />
                <span className="truncate">Inventario</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  inventorySubmenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {inventorySubmenuOpen && (
              <div className="pl-9 pr-2 py-1 space-y-1">
                <button
                  onClick={() => onSelectTab('INVENTARIO')}
                  className="w-full text-left py-1.5 px-2 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 rounded transition-colors"
                >
                  Gestión Catálogo Libros & Útiles
                </button>
                <button
                  onClick={() => onSelectTab('INVENTARIO')}
                  className="w-full text-left py-1.5 px-2 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 rounded transition-colors"
                >
                  Stock e Insumos / Papel
                </button>
              </div>
            )}
          </div>

          {/* HISTORIAL VENTAS */}
          <button
            onClick={() => onSelectTab('HISTORIAL')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              currentTab === 'HISTORIAL'
                ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4 shrink-0" />
            <span className="truncate">Historial Ventas</span>
          </button>

          {/* FINANZAS Y REPORTES */}
          <button
            onClick={() => onSelectTab('FINANZAS')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              currentTab === 'FINANZAS'
                ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span className="truncate">Finanzas y Reportes</span>
          </button>

          {/* BASE CLIENTES */}
          <button
            onClick={() => onSelectTab('CLIENTES')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              currentTab === 'CLIENTES'
                ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate">Base Clientes (NIT/CI)</span>
          </button>

          {/* EQUIPO / STAFF */}
          <button
            onClick={() => onSelectTab('EQUIPO')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              currentTab === 'EQUIPO'
                ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="truncate">Equipo / Turnos</span>
          </button>
        </nav>
      </div>

      {/* Bottom Profile Card */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/70 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-sm">
            {cashierName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate uppercase">
              {cashierName}
            </p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              ADMINISTRADOR
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors uppercase tracking-wider"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Desconectar / Cambiar</span>
        </button>
      </div>
    </aside>
  );
};
