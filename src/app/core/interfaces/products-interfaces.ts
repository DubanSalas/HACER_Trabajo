export interface ProductDTO {
  idProduct: number;
  productCode: string;
  productName: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  initialStock: number;
  imageUrl: string;
  status: string;
  totalStockValue: number;
  lowStock: boolean;
  outOfStock: boolean;
}

export interface ProductRequest {
  productCode: string;
  productName: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  initialStock: number;
}

export interface ProductSummary {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalInventoryValue: number;
  averagePrice: number;
}

export interface TopProduct {
  product: ProductDTO;
  totalSold?: number;
  revenue?: number;
}

export interface TopProductByStock {
  product: ProductDTO;
  stockLevel: number;
}