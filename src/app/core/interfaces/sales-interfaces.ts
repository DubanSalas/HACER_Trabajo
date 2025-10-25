export interface Sale {
  id_venta: number;
  idCustomer: number;
  id_Employee: number;
  fecha_venta: string;
  metodo_pago: string;
  total: number;
  estado: string;
  created_at?: string;
  updated_at?: string;
}

export interface SaleDetail {
  id_detalle: number;
  id_venta: number;
  id_Product: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface SaleWithDetails extends Sale {
  detalles: SaleDetail[];
  cliente_nombre?: string;
  empleado_nombre?: string;
}

export interface CreateSaleRequest {
  idCustomer: number;
  id_Employee: number;
  metodo_pago: string;
  estado: string;
  detalles: {
    id_Product: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export interface UpdateSaleRequest {
  idCustomer?: number;
  id_Employee?: number;
  metodo_pago?: string;
  estado?: string;
  detalles?: {
    id_Product: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export interface SaleStats {
  ventas_totales: number;
  ventas_hoy: number;
  completadas: number;
  pendientes: number;
  total_ventas: number;
  total_hoy: number;
}

export interface SaleFilters {
  estado?: string;
  metodo_pago?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  idCustomer?: number;
  id_Employee?: number;
}

export interface SaleProduct {
  id_Product: number;
  Name: string;
  Price: number;
  Stock: number;
}