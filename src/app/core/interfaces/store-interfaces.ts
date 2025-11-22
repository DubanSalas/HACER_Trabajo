export interface StoreItemDTO {
  idStoreItem: number;
  itemCode: string;
  productName: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  unitPrice: number;
  supplierId: number;
  supplierName: string;
  expiryDate: string;
  location: string;
  status: string;
  totalStockValue: number;
  nearExpiry: boolean;
  outOfStock: boolean;
  lowStock: boolean;
}

export interface StoreItemRequest {
  itemCode: string;
  productName: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  unitPrice: number;
  supplierId: number;
  expiryDate?: string;
  location: string;
  status: string;
}

export interface StoreItemSummary {
  totalItems: number;
  availableItems: number;
  outOfStockItems: number;
  lowStockItems: number;
  nearExpiryItems: number;
  totalInventoryValue: number;
}