// Employee Interface - Basado en la tabla employee de Oracle
export interface Employee {
  id_Employee?: number
  Employee_Code: string
  Document_Type: string
  Document_Number: string
  Name: string
  Surname: string
  Hire_Date: Date
  Phone: string
  id_Location: number
  Salary: number
  Email: string
  id_Position: number
  Status: string
  createdAt?: Date
  updatedAt?: Date
}

// Position Interface - Basado en la tabla position de Oracle
export interface Position {
  id_Position: number
  Position_Name: string
  Description: string
  Status: string
}

// Location Interface - Reutilizada de suppliers
export interface Location {
  identifier_Location: number
  department: string
  province: string
  district: string
  address: string
}

export interface EmployeeResponse {
  data: Employee[]
  total: number
  page: number
  pageSize: number
}

export interface EmployeeStats {
  total: number
  activos: number
  inactivos: number
  salarioPromedio: number
}

export interface EmployeePosition {
  name: string
  count: number
}

// Para el formulario
export interface EmployeeFormData {
  Employee_Code: string
  Document_Type: string
  Document_Number: string
  Name: string
  Surname: string
  Hire_Date: Date
  Phone: string
  id_Location: number
  Salary: number
  Email: string
  id_Position: number
  Status?: string
}
