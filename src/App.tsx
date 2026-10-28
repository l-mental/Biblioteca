import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Product,
  CartItem,
  Customer,
  Sale,
  Quote,
  CashShift,
  PaymentMethod,
  NavigationTab
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_QUOTES,
  INITIAL_CASH_SHIFT
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { PosView } from './components/PosView';
import { CartSidebar } from './components/CartSidebar';
import { DashboardView } from './components/views/DashboardView';
import { InventoryView } from './components/views/InventoryView';
import { SalesHistoryView } from './components/views/SalesHistoryView';
import { FinancesView } from './components/views/FinancesView';
import { CustomersView } from './components/views/CustomersView';
import { PurchasesView } from './components/views/PurchasesView';
import { TeamView } from './components/views/TeamView';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { CashArqueoModal } from './components/modals/CashArqueoModal';
import { QuotesModal } from './components/modals/QuotesModal';
import { CustomerModal } from './components/modals/CustomerModal';
import { ScannerModal } from './components/modals/ScannerModal';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('biblioplus_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('biblioplus_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('biblioplus_theme', 'light');
    }
  }, [isDarkMode]);

  // Main navigation
  const [currentTab, setCurrentTab] = useState<NavigationTab>('VENTA_DIRECTA');
  const [inventorySubmenuOpen, setInventorySubmenuOpen] = useState(false);

  // Core Data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('biblioplus_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('biblioplus_customers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_CUSTOMERS;
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('biblioplus_quotes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_QUOTES;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('biblioplus_sales');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Initial completed sample sale
    return [
      {
        id: 'FAC-004819',
        date: '28/10/2026 09:15',
        timestamp: Date.now() - 3600000,
        customer: INITIAL_CUSTOMERS[0],
        items: [
          { product: INITIAL_PRODUCTS[0], quantity: 1, discountPercent: 0 },
          { product: INITIAL_PRODUCTS[2], quantity: 2, discountPercent: 0 },
        ],
        subtotal: 156.0,
        discount: 0,
        tax: 0,
        total: 156.0,
        paymentMethod: 'EFECTIVO',
        cashTendered: 200.0,
        change: 44.0,
        cashier: 'ADMINISTRADOR SISTEMA',
        status: 'COMPLETADA',
      },
      {
        id: 'FAC-004820',
        date: '28/10/2026 10:45',
        timestamp: Date.now() - 1800000,
        customer: INITIAL_CUSTOMERS[2], // Arq. Valentina
        items: [
          { product: INITIAL_PRODUCTS[3], quantity: 1, discountPercent: 0 },
          { product: INITIAL_PRODUCTS[4], quantity: 1, discountPercent: 0 },
        ],
        subtotal: 230.0,
        discount: 0,
        tax: 0,
        total: 230.0,
        paymentMethod: 'PAGO QR',
        cashier: 'ADMINISTRADOR SISTEMA',
        status: 'COMPLETADA',
      }
    ];
  });

  const [cashShift, setCashShift] = useState<CashShift>(() => {
    const saved = localStorage.getItem('biblioplus_cash_shift');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_CASH_SHIFT;
  });

  // Current POS Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(INITIAL_CUSTOMERS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EFECTIVO');

  // Modals visibility
  const [receiptModalSale, setReceiptModalSale] = useState<Sale | null>(null);
  const [isCashArqueoOpen, setIsCashArqueoOpen] = useState(false);
  const [isQuotesOpen, setIsQuotesOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('biblioplus_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('biblioplus_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('biblioplus_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('biblioplus_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('biblioplus_cash_shift', JSON.stringify(cashShift));
  }, [cashShift]);

  // POS Actions
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, discountPercent: 0 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Checkout execution
  const handleCheckout = (tenderedAmount?: number) => {
    if (cart.length === 0) return;

    const rawSubtotal = cart.reduce((sum, item) => {
      const itemPrice = item.product.price;
      const discount = (itemPrice * item.discountPercent) / 100;
      return sum + (itemPrice - discount) * item.quantity;
    }, 0);

    const customerDiscount = selectedCustomer.discountRate
      ? (rawSubtotal * selectedCustomer.discountRate) / 100
      : 0;

    const total = Math.max(0, rawSubtotal - customerDiscount);
    const tendered = tenderedAmount || total;
    const change = Math.max(0, tendered - total);

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('es-BO')} ${now.toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newSaleId = `FAC-00${Math.floor(1000 + Math.random() * 9000)}`;

    const newSale: Sale = {
      id: newSaleId,
      date: formattedDate,
      timestamp: Date.now(),
      customer: selectedCustomer,
      items: [...cart],
      subtotal: rawSubtotal,
      discount: customerDiscount,
      tax: total * 0.13, // 13% IVA
      total,
      paymentMethod,
      cashTendered: paymentMethod === 'EFECTIVO' ? tendered : undefined,
      change: paymentMethod === 'EFECTIVO' ? change : undefined,
      cashier: cashShift.cashier,
      status: 'COMPLETADA',
    };

    // Update sales
    setSales((prev) => [newSale, ...prev]);

    // Update product stock in catalog
    setProducts((prev) =>
      prev.map((prod) => {
        const soldItem = cart.find((c) => c.product.id === prod.id);
        if (soldItem && !prod.isService) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - soldItem.quantity),
          };
        }
        return prod;
      })
    );

    // Update cash shift expected amount
    setCashShift((prev) => {
      const addCash = paymentMethod === 'EFECTIVO' ? total : 0;
      const addQr = paymentMethod === 'PAGO QR' ? total : 0;
      const addCard = paymentMethod === 'MIXTO' || paymentMethod === 'TARJETA' ? total : 0;

      return {
        ...prev,
        expectedCash: prev.expectedCash + addCash,
        totalSalesCash: prev.totalSalesCash + addCash,
        totalSalesQr: prev.totalSalesQr + addQr,
        totalSalesCard: prev.totalSalesCard + addCard,
      };
    });

    // Award loyalty points to customer
    if (selectedCustomer.id !== INITIAL_CUSTOMERS[0].id) {
      const earnedPoints = Math.floor(total / 10);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id
            ? { ...c, points: c.points + earnedPoints }
            : c
        )
      );
    }

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {}

    // Open receipt modal and clear cart
    setReceiptModalSale(newSale);
    setCart([]);
  };

  // Add Cash Movement in shift
  const handleAddMovement = (
    type: 'INGRESO' | 'EGRESO',
    amount: number,
    reason: string
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMov = {
      id: `mov-${Date.now()}`,
      type,
      amount,
      reason,
      timestamp: timeStr,
      cashier: cashShift.cashier,
    };

    setCashShift((prev) => ({
      ...prev,
      expectedCash:
        type === 'INGRESO'
          ? prev.expectedCash + amount
          : Math.max(0, prev.expectedCash - amount),
      movements: [newMov, ...prev.movements],
    }));
  };

  // Close shift
  const handleCloseShift = () => {
    alert(
      `Cierre de Turno #${cashShift.shiftNumber} Completado con Éxito.\nEfectivo final registrado: Bs ${cashShift.expectedCash.toFixed(
        2
      )}.\nSe inicia nuevo turno # ${cashShift.shiftNumber + 1}.`
    );

    setCashShift({
      shiftNumber: cashShift.shiftNumber + 1,
      isOpen: true,
      openedAt: new Date().toISOString(),
      cashier: cashShift.cashier,
      initialCash: 500.0,
      expectedCash: 500.0,
      totalSalesCash: 0,
      totalSalesQr: 0,
      totalSalesCard: 0,
      movements: [
        {
          id: `mov-${Date.now()}`,
          type: 'INGRESO',
          amount: 500.0,
          reason: `Apertura de Turno #${cashShift.shiftNumber + 1}`,
          timestamp: new Date().toLocaleTimeString('es-BO', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          cashier: cashShift.cashier,
        }
      ],
    });
    setIsCashArqueoOpen(false);
  };

  // Load quote into cart
  const handleLoadQuoteIntoCart = (quote: Quote) => {
    setCart(quote.items);
    setSelectedCustomer(quote.customer);
    setIsQuotesOpen(false);
    setCurrentTab('VENTA_DIRECTA');
  };

  // Save current cart as quote
  const handleCreateQuoteFromCart = () => {
    if (cart.length === 0) return;
    const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const newQuote: Quote = {
      id: `COT-000${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('es-BO'),
      customer: selectedCustomer,
      items: [...cart],
      total: rawSubtotal,
      validUntil: '15/11/2026',
      notes: 'Presupuesto escolar emitido en mostrador de librería.',
    };

    setQuotes((prev) => [newQuote, ...prev]);
    alert(`¡Proforma ${newQuote.id} guardada exitosamente!`);
    setIsQuotesOpen(false);
  };

  // Cancel sale and restore stock
  const handleCancelSale = (saleId: string) => {
    const target = sales.find((s) => s.id === saleId);
    if (!target) return;

    if (!confirm(`¿Estás seguro de anular la venta ${target.id}? Se revertirá el stock.`)) {
      return;
    }

    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: 'ANULADA' } : s))
    );

    // Restore stock
    setProducts((prev) =>
      prev.map((p) => {
        const item = target.items.find((i) => i.product.id === p.id);
        if (item && !p.isService) {
          return { ...p, stock: p.stock + item.quantity };
        }
        return p;
      })
    );

    // Deduct from cash if was paid in cash
    if (target.paymentMethod === 'EFECTIVO') {
      setCashShift((prev) => ({
        ...prev,
        expectedCash: Math.max(0, prev.expectedCash - target.total),
      }));
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        inventorySubmenuOpen={inventorySubmenuOpen}
        onToggleInventorySubmenu={() => setInventorySubmenuOpen(!inventorySubmenuOpen)}
        onLogout={() => {
          const next = prompt('Ingrese el nombre del nuevo cajero / usuario:', 'LUCÍA VARGAS');
          if (next) {
            setCashShift((prev) => ({ ...prev, cashier: next.toUpperCase() }));
          }
        }}
        cashierName={cashShift.cashier}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar matching screenshot */}
        <HeaderBar
          cashShift={cashShift}
          quotesCount={quotes.length}
          onOpenQuotes={() => setIsQuotesOpen(true)}
          onOpenCashArqueo={() => setIsCashArqueoOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        {/* View Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {currentTab === 'VENTA_DIRECTA' && (
            <>
              {/* POS Catalog & Services Grid */}
              <PosView
                products={products}
                onAddToCart={handleAddToCart}
                onOpenScanner={() => setIsScannerOpen(true)}
              />

              {/* Terminal POS Right Column matching screenshot */}
              <CartSidebar
                cart={cart}
                customer={selectedCustomer}
                paymentMethod={paymentMethod}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onClearCart={handleClearCart}
                onChangeCustomer={() => setIsCustomerModalOpen(true)}
                onSetPaymentMethod={setPaymentMethod}
                onCheckout={handleCheckout}
              />
            </>
          )}

          {currentTab === 'TABLERO' && (
            <DashboardView
              products={products}
              sales={sales}
              cashShift={cashShift}
              onGoToPos={() => setCurrentTab('VENTA_DIRECTA')}
            />
          )}

          {currentTab === 'INVENTARIO' && (
            <InventoryView
              products={products}
              onAddProduct={(newP) => setProducts((prev) => [newP, ...prev])}
              onUpdateProduct={(updP) =>
                setProducts((prev) => prev.map((p) => (p.id === updP.id ? updP : p)))
              }
              onDeleteProduct={(delId) =>
                setProducts((prev) => prev.filter((p) => p.id !== delId))
              }
            />
          )}

          {currentTab === 'HISTORIAL' && (
            <SalesHistoryView
              sales={sales}
              onReprintReceipt={(sale) => setReceiptModalSale(sale)}
              onCancelSale={handleCancelSale}
            />
          )}

          {currentTab === 'FINANZAS' && (
            <FinancesView sales={sales} cashShift={cashShift} />
          )}

          {currentTab === 'CLIENTES' && (
            <CustomersView
              customers={customers}
              onAddNewCustomer={(newC) => setCustomers((prev) => [...prev, newC])}
              onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
            />
          )}

          {currentTab === 'COMPRAS' && <PurchasesView />}

          {currentTab === 'EQUIPO' && (
            <TeamView
              cashShift={cashShift}
              onSwitchCashier={(name) =>
                setCashShift((prev) => ({ ...prev, cashier: name }))
              }
            />
          )}
        </div>
      </div>

      {/* 3. Global Modals */}
      {receiptModalSale && (
        <ReceiptModal
          sale={receiptModalSale}
          onClose={() => setReceiptModalSale(null)}
        />
      )}

      {isCashArqueoOpen && (
        <CashArqueoModal
          cashShift={cashShift}
          onClose={() => setIsCashArqueoOpen(false)}
          onAddMovement={handleAddMovement}
          onCloseShift={handleCloseShift}
        />
      )}

      {isQuotesOpen && (
        <QuotesModal
          quotes={quotes}
          onClose={() => setIsQuotesOpen(false)}
          onLoadQuoteIntoCart={handleLoadQuoteIntoCart}
          onCreateQuoteFromCart={handleCreateQuoteFromCart}
          canCreateFromCart={cart.length > 0}
        />
      )}

      {isCustomerModalOpen && (
        <CustomerModal
          customers={customers}
          selectedCustomerId={selectedCustomer.id}
          onClose={() => setIsCustomerModalOpen(false)}
          onSelectCustomer={(c) => {
            setSelectedCustomer(c);
            setIsCustomerModalOpen(false);
          }}
          onAddNewCustomer={(newC) => {
            setCustomers((prev) => [...prev, newC]);
          }}
        />
      )}

      {isScannerOpen && (
        <ScannerModal
          products={products}
          onClose={() => setIsScannerOpen(false)}
          onScanProduct={(prod) => {
            handleAddToCart(prod);
            setCurrentTab('VENTA_DIRECTA');
          }}
        />
      )}
    </div>
  );
}
