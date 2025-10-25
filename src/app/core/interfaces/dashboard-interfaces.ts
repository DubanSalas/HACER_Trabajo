// Dashboard Interface
export interface DashboardStats {
  totalSales: number
  totalCustomers: number
  totalEmployees: number
  totalProducts: number
  totalSuppliers: number
  recentSales: Sale[]
  topProducts: Product[]
  stockAlerts: StockAlert[]
}

export interface Sale {
  id: number
  saleId: string
  customerName: string
  total: number
  date: Date
  status: string
}

export interface Product {
  id: number
  productName: string
  stock: number
  sales: number
}

export interface StockAlert {
  productId: number
  productName: string
  currentStock: number
  minimumStock: number
}
