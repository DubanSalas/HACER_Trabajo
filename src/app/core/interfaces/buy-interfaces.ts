// Buy/Purchase Interface
export interface Purchase {
  id?: number
  purchaseId: string
  supplierId: number
  purchaseDate: Date
  status: string
  total: number
  items?: PurchaseItem[]
  createdAt?: Date
  updatedAt?: Date
}

export interface PurchaseItem {
  id?: number
  purchaseId?: number
  productId: number
  quantity: number
  price: number
  subtotal: number
}

export interface PurchaseResponse {
  data: Purchase[]
  total: number
  page: number
  pageSize: number
}
