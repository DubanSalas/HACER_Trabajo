// Customer Interface - Basado en CustomerDTO del backend
export interface Customer {
  idCustomer?: number;
  clientCode: string;
  documentType: string;
  documentNumber: string;
  name: string;
  surname: string;
  dateBirth: string; // LocalDate se maneja como string en frontend
  phone: string;
  email: string;
  locationId: number;
  department: string;
  province: string;
  district: string;
  locationAddress: string;
  registerDate?: string; // LocalDate se maneja como string en frontend
  status: string;
}

// Location Interface - Basado en Location.java del backend
export interface Location {
  idLocation?: number;
  department: string;
  province: string;
  district: string;
  address: string;
}

// CustomerSummaryDTO del backend
export interface CustomerSummary {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  newThisMonth: number;
}

// CustomerRequest para crear/actualizar
export interface CustomerRequest {
  clientCode: string;
  documentType: string;
  documentNumber: string;
  name: string;
  surname: string;
  dateBirth: string;
  phone: string;
  email: string;
  locationId: number;
  status?: string;
}

// Para filtros de búsqueda
export interface CustomerFilters {
  search?: string;
  status?: string;
  department?: string;
  province?: string;
  district?: string;
  locationId?: number;
}
