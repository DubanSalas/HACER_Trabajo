export interface BuyDTO {
  idBuys?: number;
  purchaseDate: string;
  totalAmount: number;
  paymentType: string;
  supplierId: number;
  supplierName: string;
  details?: PurchaseDetailDTO[];
}

export interface PurchaseDetailDTO {
  idDetail?: number;
  productId: number;
  productName: string;
  amount: number;
  subtotal: number;
}

export interface BuyRequest {
  purchaseDate: string;
  totalAmount: number;
  paymentType: string;
  supplierId: number;
  details: PurchaseDetailRequest[];
}

export interface PurchaseDetailRequest {
  productId: number;
  amount: number;
  subtotal: number;
}

export interface BuySummary {
  totalPurchases: number;
  totalAmount: number;
  averagePurchaseAmount: number;
  purchasesThisMonth: number;
  amountThisMonth: number;
}