export interface StoreItem {
  id_store: number;
  id_Product: number;
  product_name: string;
  category: string;
  current_stock: number;
  min_stock: number;
  unit: string;
  unit_price: number;
  id_Supplier: number;
  supplier_name?: string;
  expiry_date: string;
  location: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStoreItemRequest {
  id_Product: number;
  current_stock: number;
  min_stock: number;
  unit: string;
  unit_price: number;
  id_Supplier: number;
  expiry_date: string;
  location: string;
  status: string;
}

export interface UpdateStoreItemRequest {
  id_Product?: number;
  current_stock?: number;
  min_stock?: number;
  unit?: string;
  unit_price?: number;
  id_Supplier?: number;
  expiry_date?: string;
  location?: string;
  status?: string;
}

export interface StoreStats {
  total_products: number;
  low_stock: number;
  out_of_stock: number;
  expiring_soon: number;
  total_value: number;
}

export interface StoreFilters {
  category?: string;
  status?: string;
  supplier?: string;
  low_stock?: boolean;
  expiring_soon?: boolean;
}

export interface StockMovement {
  id_movement: number;
  id_store: number;
  movement_type: string; // 'IN' | 'OUT' | 'ADJUSTMENT'
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  created_by: number;
  created_at: string;
}

export interface CreateStockMovementRequest {
  id_store: number;
  movement_type: string;
  quantity: number;
  reason: string;
  created_by: number;
}

export interface StoreProduct {
  id_Product: number;
  Product_Name: string;
  Category: string;
  Price: number;
}

export interface StoreSupplier {
  id_Supplier: number;
  Company_Name: string;
  Contact_Name: string;
}