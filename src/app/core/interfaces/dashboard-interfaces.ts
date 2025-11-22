export interface DashboardSummary {
  ventasDelDia: number;
  porcentajeVentasAyer: string;
  totalClientes: number;
  porcentajeClientesAyer: string;
  totalEmpleados: number;
  porcentajeEmpleadosAyer: string;
  totalProductos: number;
  productosDisponibles: number;
  ventasRecientes?: VentaReciente[];
  productosMasVendidos?: ProductoMasVendido[];
  alertasStock?: AlertaStock[];
}

export interface VentaReciente {
  clienteNombre: string;
  cantidadProductos: number;
  montoTotal: number;
  estado: string;
}

export interface ProductoMasVendido {
  nombreProducto: string;
  stockActual: number;
  cantidadVendida: number;
}

export interface AlertaStock {
  nombreProducto: string;
  stockActual: number;
  tipoAlerta: string;
}

export interface SaleRecentSummary {
  idSale: number;
  saleCode: string;
  customerName: string;
  customerSurname: string;
  customerFullName: string;
  total: number;
  saleDate: string;
  status: string;
  paymentMethod: string;
}

export interface CompleteDashboardData {
  summary: DashboardSummary;
  recentSales: SaleRecentSummary[];
  topProducts: TopProduct[];
  lowStockItems: LowStockItem[];
  recentCustomers: RecentCustomer[];
  employeeSummary: EmployeeSummary[];
  supplierSummary: SupplierSummary[];
}

export interface TopProduct {
  productName: string;
  totalSold: number;
  revenue: number;
  category: string;
}

export interface LowStockItem {
  productName: string;
  currentStock: number;
  minimumStock: number;
  category: string;
  location: string;
}

export interface RecentCustomer {
  clientCode: string;
  fullName: string;
  email: string;
  registerDate: string;
  totalPurchases: number;
}

export interface EmployeeSummary {
  employeeCode: string;
  fullName: string;
  positionName: string;
  hireDate: string;
  status: string;
}

export interface SupplierSummary {
  companyName: string;
  contactName: string;
  category: string;
  status: string;
  phone: string;
}