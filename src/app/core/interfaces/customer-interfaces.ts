export interface CustomerDTO {
  idCustomer?: number;
  clientCode: string;
  documentType: string;
  documentNumber: string;
  name: string;
  surname: string;
  dateBirth: string;
  phone: string;
  email: string;
  address: string;
  locationId: number;
  department: string;
  province: string;
  district: string;
  locationAddress: string;
  registerDate?: string;
  status: string;
}

export interface CustomerRequest {
  clientCode: string;
  documentType: string;
  documentNumber: string;
  name: string;
  surname: string;
  dateBirth: string;
  phone: string;
  email: string;
  address: string;
  department: string;
  province: string;
  district: string;
  locationId: number;
  status: string;
}

export interface CustomerSummary {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  newCustomersThisMonth: number;
}