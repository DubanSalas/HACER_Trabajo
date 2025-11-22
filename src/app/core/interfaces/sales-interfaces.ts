export interface SaleDTO {
  idSale: number;
  saleCode: string;
  saleDate: string;
  paymentMethod: string;
  total: number;
  status: string;
  customerId: number;
  customerName: string;
  customerSurname: string;
  customerFullName: string;
  employeeId: number;
  employeeName: string;
  employeeSurname: string;
  employeeFullName: string;
  details: SaleDetailDTO[];
}

export interface SaleRequest {
  saleCode: string;
  saleDate: string;
  customerId: number;
  employeeId: number;
  paymentMethod: string;
  status: string;
  details: SaleDetailRequest[];
}

export interface SaleDetailDTO {
  idSaleDetail: number;
  saleId: number;
  productId: number;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleDetailRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CustomerBasicDTO {
  idCustomer: number;
  name: string;
  surname: string;
  clientCode: string;
}

export interface EmployeeBasicDTO {
  idEmployee: number;
  name: string;
  surname: string;
  employeeCode: string;
}

export interface ProductBasicDTO {
  idProduct: number;
  productName: string;
  productCode: string;
  price: number;
}

export interface SaleSummary {
  totalSales: number;
  todaySales: number;
  completedSales: number;
  pendingSales: number;
  totalRevenue: number;
  todayRevenue: number;
}