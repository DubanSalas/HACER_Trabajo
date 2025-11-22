export interface EmployeeDTO {
  idEmployee: number;
  employeeCode: string;
  documentType: string;
  documentNumber: string;
  name: string;
  surname: string;
  hireDate: string;
  phone: string;
  salary: number;
  email: string;
  status: string;
  locationId: number;
  department: string;
  province: string;
  district: string;
  address: string;
  positionId: number;
  positionName: string;
}

export interface EmployeeRequest {
  employeeCode: string;
  documentType: string;
  documentNumber: string;
  name: string;
  surname: string;
  hireDate: string;
  phone: string;
  salary: number;
  email: string;
  idPosition: number;
  idLocation: number;
}

export interface PositionDTO {
  idPosition: number;
  positionName: string;
  description: string;
  status: string;
}

export interface LocationDTO {
  idLocation: number;
  department: string;
  province: string;
  district: string;
  address: string;
}

export interface EmployeeSummary {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  averageSalary: number;
}