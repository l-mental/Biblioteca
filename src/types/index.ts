export type ProductCategory = 
  | 'LITERATURA'
  | 'TEXTOS ESCOLARES'
  | 'PAPELERÍA'
  | 'ARTE Y DIBUJO'
  | 'TECNOLOGÍA'
  | 'SERVICIOS';

export interface Product {
  id: string;
  title: string;
  author?: string;
  editorial?: string;
  category: ProductCategory;
  sku: string; // Barcode or ISBN
  stock: number;
  minStock: number;
  price: number; // in Bolivianos (Bs)
  costPrice: number;
  imageUrl?: string;
  location?: string;
  isService?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discountPercent: number; // 0 to 100
  customPrice?: number;
}

export interface Customer {
  id: string;
  name: string;
  nitCi: string;
  email?: string;
  phone?: string;
  points: number;
  discountRate?: number;
}

export type PaymentMethod = 'EFECTIVO' | 'PAGO QR' | 'MIXTO' | 'TARJETA';

export interface Sale {
  id: string; // e.g. TIK-004921
  date: string;
  timestamp: number;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashTendered?: number;
  change?: number;
  cashier: string;
  status: 'COMPLETADA' | 'ANULADA';
  authorizationCode?: string;
}

export interface Quote {
  id: string; // e.g. COT-00084
  date: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  validUntil: string;
  notes?: string;
}

export interface CashMovement {
  id: string;
  type: 'INGRESO' | 'EGRESO';
  amount: number;
  reason: string;
  timestamp: string;
  cashier: string;
}

export interface CashShift {
  shiftNumber: number;
  isOpen: boolean;
  openedAt: string;
  cashier: string;
  initialCash: number;
  expectedCash: number;
  totalSalesCash: number;
  totalSalesQr: number;
  totalSalesCard: number;
  movements: CashMovement[];
}

export type NavigationTab = 
  | 'VENTA_DIRECTA'
  | 'TABLERO'
  | 'INVENTARIO'
  | 'COMPRAS'
  | 'HISTORIAL'
  | 'FINANZAS'
  | 'CLIENTES'
  | 'EQUIPO';
