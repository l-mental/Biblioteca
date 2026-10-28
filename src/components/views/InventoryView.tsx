import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Download,
  AlertTriangle,
  Edit2,
  Trash2,
  Check,
  X,
  BookOpen,
  Filter
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';

interface InventoryViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form states
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formEditorial, setFormEditorial] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('LITERATURA');
  const [formSku, setFormSku] = useState('');
  const [formStock, setFormStock] = useState('20');
  const [formMinStock, setFormMinStock] = useState('5');
  const [formPrice, setFormPrice] = useState('25.00');
  const [formCostPrice, setFormCostPrice] = useState('16.00');
  const [formLocation, setFormLocation] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'TODOS' || p.category === selectedCategory;

    const matchLowStock = !onlyLowStock || (!p.isService && p.stock <= p.minStock);

    const q = searchTerm.toLowerCase().trim();
    if (!q) return matchCategory && matchLowStock;

    const matchSearch =
      p.title.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.author && p.author.toLowerCase().includes(q)) ||
      (p.editorial && p.editorial.toLowerCase().includes(q));

    return matchCategory && matchLowStock && matchSearch;
  });

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSku.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: formTitle.trim().toUpperCase(),
      author: formAuthor.trim() || undefined,
      editorial: formEditorial.trim() || undefined,
      category: formCategory,
      sku: formSku.trim(),
      stock: parseInt(formStock, 10) || 0,
      minStock: parseInt(formMinStock, 10) || 0,
      price: parseFloat(formPrice) || 0,
      costPrice: parseFloat(formCostPrice) || 0,
      location: formLocation.trim() || undefined,
      imageUrl: formImageUrl.trim() || undefined,
    };

    onAddProduct(newProd);
    setIsAddingProduct(false);
    // Reset form
    setFormTitle('');
    setFormAuthor('');
    setFormEditorial('');
    setFormSku('');
    setFormLocation('');
    setFormImageUrl('');
  };

  const handleInlineStockChange = (product: Product, delta: number) => {
    const updatedStock = Math.max(0, product.stock + delta);
    onUpdateProduct({
      ...product,
      stock: updatedStock,
    });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'TITULO', 'AUTOR', 'CATEGORIA', 'SKU_ISBN', 'STOCK', 'PRECIO_BS', 'UBICACION'];
    const rows = products.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${(p.author || '').replace(/"/g, '""')}"`,
      p.category,
      p.sku,
      p.stock,
      p.price.toFixed(2),
      `"${(p.location || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Inventario_Libreria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-cyan-500" />
            <span>Gestión de Inventario & Catálogo</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Control de existencias de libros, novelas, textos escolares, papelería y servicios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-cyan-500" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsAddingProduct(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-black uppercase flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Artículo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título de libro, autor, editorial o código ISBN..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value="TODOS">Todas las Categorías</option>
              <option value="LITERATURA">Literatura & Libros</option>
              <option value="TEXTOS ESCOLARES">Textos Escolares</option>
              <option value="PAPELERÍA">Papelería</option>
              <option value="ARTE Y DIBUJO">Arte y Dibujo</option>
              <option value="TECNOLOGÍA">Tecnología & Cálculo</option>
              <option value="SERVICIOS">Servicios de Fotocopiado</option>
            </select>

            <button
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                onlyLowStock
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Stock Bajo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Modal Drawer */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-cyan-600 text-white flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider">
                Registrar Nuevo Libro / Artículo Escolar
              </h3>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="p-1 rounded-lg hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Título del Libro o Producto *:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: RAYUELA, CUADERNO ESPIRAL 200H..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 uppercase outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Autor / Marca:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Julio Cortázar, Faber-Castell..."
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Editorial / Fabricante:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Alfaguara, Santillana..."
                    value={formEditorial}
                    onChange={(e) => setFormEditorial(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Categoría *:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                  >
                    <option value="LITERATURA">LITERATURA</option>
                    <option value="TEXTOS ESCOLARES">TEXTOS ESCOLARES</option>
                    <option value="PAPELERÍA">PAPELERÍA</option>
                    <option value="ARTE Y DIBUJO">ARTE Y DIBUJO</option>
                    <option value="TECNOLOGÍA">TECNOLOGÍA</option>
                    <option value="SERVICIOS">SERVICIOS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Código de Barras / ISBN *:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 9789505118742"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full text-xs font-mono-numbers font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Precio de Venta (Bs) *:
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full text-xs font-mono-numbers font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Costo de Compra (Bs):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(e.target.value)}
                    className="w-full text-xs font-mono-numbers font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Stock Inicial:
                  </label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full text-xs font-mono-numbers font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Stock Mínimo (Alerta):
                  </label>
                  <input
                    type="number"
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(e.target.value)}
                    className="w-full text-xs font-mono-numbers font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Ubicación Física en Librería:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Estante B1 - Nivel 3"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-extrabold uppercase shadow-xs transition-all cursor-pointer"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Artículo / Libro</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3">ISBN / Código</th>
                <th className="py-3 px-3 text-right">Precio Venta</th>
                <th className="py-3 px-3 text-center">Stock Actual</th>
                <th className="py-3 px-3">Ubicación</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.map((p) => {
                const isLow = !p.isService && p.stock <= p.minStock;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 dark:text-slate-100 uppercase truncate max-w-xs">
                            {p.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {p.author || p.editorial || 'Librería General'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-[11px] text-slate-600 dark:text-slate-300">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono-numbers font-bold text-slate-500">
                      {p.sku}
                    </td>

                    <td className="py-3 px-3 text-right font-mono-numbers font-black text-slate-900 dark:text-white">
                      Bs {p.price.toFixed(2)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {!p.isService ? (
                          <>
                            <button
                              onClick={() => handleInlineStockChange(p, -1)}
                              className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span
                              className={`font-mono-numbers font-black min-w-[32px] text-center ${
                                isLow ? 'text-amber-600 font-extrabold' : 'text-slate-800 dark:text-slate-100'
                              }`}
                            >
                              {p.stock}
                            </span>
                            <button
                              onClick={() => handleInlineStockChange(p, 1)}
                              className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] font-bold text-cyan-600">Servicio</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-[11px] text-slate-500">
                      {p.location || 'Exhibidor'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Eliminar artículo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
