export interface SupplierDTO {
  idSupplier?: number;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  paymentTerms: string;
  locationId: number;
  department: string;
  province: string;
  district: string;
  locationAddress: string;
  status: string;
}

export interface SupplierRequest {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  paymentTerms: string;
  locationId: number;
  status: string;
}

export interface SupplierSummary {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  suspendedSuppliers: number;
}