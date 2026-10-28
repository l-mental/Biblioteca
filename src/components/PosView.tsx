import React, { useState, useMemo } from 'react';
import {
  Search,
  Barcode,
  Sparkles,
  Printer,
  Copy,
  Book,
  FileCheck2,
  Package,
  Layers,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface PosViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOpenScanner: () => void;
}

const CATEGORIES: { label: string; value: ProductCategory | 'TODOS' }[] = [
  { label: 'Todos los Artículos', value: 'TODOS' },
  { label: 'Literatura & Libros', value: 'LITERATURA' },
  { label: 'Textos Escolares', value: 'TEXTOS ESCOLARES' },
  { label: 'Papelería & Cuadernos', value: 'PAPELERÍA' },
  { label: 'Arte & Dibujo', value: 'ARTE Y DIBUJO' },
  { label: 'Tecnología & Cálculo', value: 'TECNOLOGÍA' },
  { label: 'Servicios de Copiado', value: 'SERVICIOS' },
];

export const PosView: React.FC<PosViewProps> = ({
  products,
  onAddToCart,
  onOpenScanner,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'TODOS'>('TODOS');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCategory =
        selectedCategory === 'TODOS' || prod.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;

      const matchSearch =
        prod.title.toLowerCase().includes(q) ||
        prod.sku.toLowerCase().includes(q) ||
        (prod.author && prod.author.toLowerCase().includes(q)) ||
        prod.category.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleCardClick = (product: Product) => {
    onAddToCart(product);
    setJustAddedId(product.id);
    setTimeout(() => {
      setJustAddedId((prev) => (prev === product.id ? null : prev));
    }, 400);
  };

  // Quick Bookstore Services items
  const quickServices = products.filter((p) => p.isService);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100/70 dark:bg-slate-950/60 p-5 space-y-4">
      {/* Search and Category Filters */}
      <div className="space-y-3">
        {/* Search Bar matching screenshot */}
        <div className="relative flex items-center">
          <div className="absolute left-4.5 text-cyan-600 dark:text-cyan-400 pointer-events-none">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="BUSCAR POR NOMBRE, CATEGORÍA O CÓDIGO DE BARRAS / ISBN..."
            className="w-full bg-slate-200/70 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-transparent focus:border-cyan-500 rounded-2xl pl-12 pr-28 py-3.5 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 uppercase tracking-wider outline-none transition-all shadow-inner"
          />
          <div className="absolute right-3 flex items-center gap-1.5">
            <button
              onClick={onOpenScanner}
              title="Escanear Código de Barras o ISBN"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-300 border border-slate-200 dark:border-slate-600 text-[11px] font-extrabold uppercase shadow-2xs hover:bg-cyan-50 dark:hover:bg-slate-600 transition-all cursor-pointer"
            >
              <Barcode className="w-4 h-4" />
              <span className="hidden sm:inline">Escanear</span>
            </button>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-white shadow-xs shadow-cyan-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Services Strip for Bookstore */}
      {quickServices.length > 0 && selectedCategory === 'TODOS' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-slate-800 dark:text-slate-200 leading-tight">
                Servicios de Mostrador
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                Acceso Rápido 1 Clic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {quickServices.map((serv) => (
              <button
                key={serv.id}
                onClick={() => handleCardClick(serv)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 border border-slate-200 dark:border-slate-700 hover:border-cyan-400 text-slate-700 dark:text-slate-200 transition-all cursor-pointer text-xs font-bold"
              >
                <span className="truncate max-w-[130px]">{serv.title.replace('SERVICIO', '').trim()}</span>
                <span className="font-mono-numbers text-cyan-600 dark:text-cyan-400 font-black">
                  Bs {serv.price.toFixed(2)}
                </span>
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[11px] font-black">
                  +
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid matching screenshot */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredProducts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              No se encontraron artículos
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Prueba buscando por título de libro, autor o código ISBN.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3.5">
            {filteredProducts.map((product) => {
              const isAdded = justAddedId === product.id;
              const isLowStock = !product.isService && product.stock <= product.minStock;

              return (
                <div
                  key={product.id}
                  onClick={() => handleCardClick(product)}
                  className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-150 cursor-pointer select-none shadow-2xs hover:shadow-md hover:border-cyan-400 dark:hover:border-cyan-500 hover:-translate-y-0.5 ${
                    isAdded
                      ? 'border-cyan-500 ring-2 ring-cyan-400/40'
                      : 'border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  {/* Top Header: Box Icon / Image + Stock Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      {/* Product Image / Icon Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              // Fallback container on image load failure
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="text-slate-400 dark:text-slate-500">
                            <Book className="w-7 h-7" />
                          </div>
                        )}
                      </div>

                      {/* Stock Badge - matching screenshot (STOCK.AVAL 083) */}
                      <div className="text-right">
                        <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                          STOCK.AVAL
                        </span>
                        <span
                          className={`font-mono-numbers font-extrabold text-sm ${
                            product.isService
                              ? 'text-cyan-600 dark:text-cyan-400'
                              : isLowStock
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {product.isService ? 'ILIM' : String(product.stock).padStart(3, '0')}
                        </span>
                        {isLowStock && (
                          <span className="flex items-center justify-end gap-1 text-[9px] text-amber-600 font-bold">
                            <AlertTriangle className="w-2.5 h-2.5" /> Bajo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Author in bold italic uppercase style matching screenshot */}
                    <div className="mt-1">
                      <h3 className="font-extrabold italic text-xs tracking-tight text-slate-900 dark:text-slate-100 line-clamp-2 uppercase leading-snug">
                        {product.title}
                      </h3>
                      {product.author && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                          {product.author}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom section: Category · Barcode & Big Price */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate uppercase tracking-wider">
                      {product.category} · {product.sku}
                    </p>

                    <div className="mt-1 flex items-baseline justify-between">
                      <div className="text-slate-900 dark:text-white font-black font-sans text-lg tracking-tight">
                        <span className="text-xs font-bold text-slate-500 mr-0.5">Bs</span>
                        {product.price.toFixed(2)}
                      </div>

                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          isAdded
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-cyan-500 group-hover:text-white'
                        }`}
                      >
                        {isAdded ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-black">+</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
