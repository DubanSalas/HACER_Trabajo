// Product Interface - Basado en la tabla product de Oracle
export interface Product {
  id_Product?: number
  Product_Code: string
  Product_Name: string
  Category: string
  Description: string
  Price: number
  Stock: number
  Initial_Stock: number
  Image_Url?: string
  Status: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ProductResponse {
  data: Product[]
  total: number
  page: number
  pageSize: number
}

export interface ProductStats {
  total: number
  disponibles: number
  stockBajo: number
  sinStock: number
  valorTotal: number
  precioPromedio: number
}

export interface ProductTopStock {
  id: number
  name: string
  stock: number
}

// Para el formulario
export interface ProductFormData {
  Product_Code: string
  Product_Name: string
  Category: string
  Description: string
  Price: number
  Stock: number
  Initial_Stock: number
  Image_Url?: string
  Status?: string
}
