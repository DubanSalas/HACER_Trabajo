// Supplier Interface - Basado en la tabla supplier de Oracle
export interface Supplier {
  id_Supplier?: number
  Company_Name: string
  Contact_Name: string
  Phone: string
  Email: string
  Address: string
  Category: string
  Payment_Terms: string
  id_Location: number
  Status: string
  createdAt?: Date
  updatedAt?: Date
}

// Location Interface - Basado en la tabla location de Oracle
export interface Location {
  identifier_Location: number
  department: string
  province: string
  district: string
  address: string
}

export interface SupplierResponse {
  data: Supplier[]
  total: number
  page: number
  pageSize: number
}

export interface SupplierStats {
  total: number
  activos: number
  inactivos: number
  suspendidos: number
}

export interface SupplierCategory {
  name: string
  count: number
}

// Para el formulario
export interface SupplierFormData {
  Company_Name: string
  Contact_Name: string
  Phone: string
  Email: string
  Address: string
  Category: string
  Payment_Terms: string
  id_Location: number
  Status?: string
}
