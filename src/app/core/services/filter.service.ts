import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'dateRange' | 'number' | 'boolean';
  options?: { value: any; label: string }[];
  placeholder?: string;
  multiple?: boolean;
}

export interface FilterValue {
  [key: string]: any;
}

export interface FilterConfig {
  searchFields: string[];
  statusField?: string;
  dateFields?: string[];
  customFilters?: FilterOption[];
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filtersSubject = new BehaviorSubject<FilterValue>({});
  public filters$ = this.filtersSubject.asObservable();

  private searchTermSubject = new BehaviorSubject<string>('');
  public searchTerm$ = this.searchTermSubject.asObservable();

  constructor() {}

  // Métodos para manejar filtros
  setFilter(key: string, value: any): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({
      ...currentFilters,
      [key]: value
    });
  }

  getFilter(key: string): any {
    return this.filtersSubject.value[key];
  }

  setFilters(filters: FilterValue): void {
    this.filtersSubject.next(filters);
  }

  getFilters(): FilterValue {
    return this.filtersSubject.value;
  }

  clearFilters(): void {
    this.filtersSubject.next({});
    this.searchTermSubject.next('');
  }

  clearFilter(key: string): void {
    const currentFilters = this.filtersSubject.value;
    const { [key]: removed, ...remainingFilters } = currentFilters;
    this.filtersSubject.next(remainingFilters);
  }

  // Métodos para búsqueda
  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  getSearchTerm(): string {
    return this.searchTermSubject.value;
  }

  // Método para aplicar filtros a datos
  applyFilters<T>(data: T[], config: FilterConfig): T[] {
    let filteredData = [...data];
    const filters = this.getFilters();
    const searchTerm = this.getSearchTerm();

    // Aplicar búsqueda por texto
    if (searchTerm && config.searchFields.length > 0) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item =>
        config.searchFields.some(field => {
          const value = this.getNestedProperty(item, field);
          return value && value.toString().toLowerCase().includes(term);
        })
      );
    }

    // Aplicar filtros específicos
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        filteredData = filteredData.filter(item => {
          const itemValue = this.getNestedProperty(item, key);
          
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          
          if (typeof value === 'object' && value.start && value.end) {
            // Filtro de rango de fechas
            const itemDate = new Date(itemValue);
            const startDate = new Date(value.start);
            const endDate = new Date(value.end);
            return itemDate >= startDate && itemDate <= endDate;
          }
          
          return itemValue === value;
        });
      }
    });

    return filteredData;
  }

  // Método helper para obtener propiedades anidadas
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  // Configuraciones predefinidas para diferentes módulos
  getCustomerFilterConfig(): FilterConfig {
    return {
      searchFields: ['name', 'surname', 'email', 'documentNumber', 'clientCode'],
      statusField: 'status',
      dateFields: ['registerDate', 'dateBirth'],
      customFilters: [
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'A', label: 'Activos' },
            { value: 'I', label: 'Inactivos' }
          ]
        },
        {
          key: 'documentType',
          label: 'Tipo de Documento',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'DNI', label: 'DNI' },
            { value: 'CE', label: 'Carnet de Extranjería' },
            { value: 'PAS', label: 'Pasaporte' }
          ]
        },
        {
          key: 'department',
          label: 'Departamento',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'Lima', label: 'Lima' },
            { value: 'Arequipa', label: 'Arequipa' },
            { value: 'Cusco', label: 'Cusco' },
            { value: 'La Libertad', label: 'La Libertad' }
          ]
        },
        {
          key: 'registerDateRange',
          label: 'Rango de Registro',
          type: 'dateRange'
        }
      ]
    };
  }

  getProductFilterConfig(): FilterConfig {
    return {
      searchFields: ['name', 'description', 'code', 'brand'],
      statusField: 'status',
      customFilters: [
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'A', label: 'Activos' },
            { value: 'I', label: 'Inactivos' }
          ]
        },
        {
          key: 'category',
          label: 'Categoría',
          type: 'select',
          options: [
            { value: '', label: 'Todas' },
            { value: 'PANADERIA', label: 'Panadería' },
            { value: 'PASTELERIA', label: 'Pastelería' },
            { value: 'BEBIDAS', label: 'Bebidas' },
            { value: 'OTROS', label: 'Otros' }
          ]
        },
        {
          key: 'priceRange',
          label: 'Rango de Precio',
          type: 'number'
        },
        {
          key: 'inStock',
          label: 'En Stock',
          type: 'boolean'
        }
      ]
    };
  }

  getEmployeeFilterConfig(): FilterConfig {
    return {
      searchFields: ['name', 'surname', 'email', 'documentNumber'],
      statusField: 'status',
      customFilters: [
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'A', label: 'Activos' },
            { value: 'I', label: 'Inactivos' }
          ]
        },
        {
          key: 'position',
          label: 'Cargo',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'GERENTE', label: 'Gerente' },
            { value: 'VENDEDOR', label: 'Vendedor' },
            { value: 'PANADERO', label: 'Panadero' },
            { value: 'CAJERO', label: 'Cajero' }
          ]
        },
        {
          key: 'department',
          label: 'Departamento',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'VENTAS', label: 'Ventas' },
            { value: 'PRODUCCION', label: 'Producción' },
            { value: 'ADMINISTRACION', label: 'Administración' }
          ]
        }
      ]
    };
  }

  getSalesFilterConfig(): FilterConfig {
    return {
      searchFields: ['customerName', 'saleCode', 'employeeName'],
      statusField: 'status',
      dateFields: ['saleDate'],
      customFilters: [
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'COMPLETED', label: 'Completada' },
            { value: 'PENDING', label: 'Pendiente' },
            { value: 'CANCELLED', label: 'Cancelada' }
          ]
        },
        {
          key: 'paymentMethod',
          label: 'Método de Pago',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'CASH', label: 'Efectivo' },
            { value: 'CARD', label: 'Tarjeta' },
            { value: 'TRANSFER', label: 'Transferencia' }
          ]
        },
        {
          key: 'saleDateRange',
          label: 'Rango de Fecha',
          type: 'dateRange'
        },
        {
          key: 'totalRange',
          label: 'Rango de Total',
          type: 'number'
        }
      ]
    };
  }

  getSupplierFilterConfig(): FilterConfig {
    return {
      searchFields: ['name', 'email', 'phone', 'ruc'],
      statusField: 'status',
      customFilters: [
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'A', label: 'Activos' },
            { value: 'I', label: 'Inactivos' }
          ]
        },
        {
          key: 'category',
          label: 'Categoría',
          type: 'select',
          options: [
            { value: '', label: 'Todas' },
            { value: 'INGREDIENTES', label: 'Ingredientes' },
            { value: 'EQUIPOS', label: 'Equipos' },
            { value: 'EMPAQUES', label: 'Empaques' },
            { value: 'SERVICIOS', label: 'Servicios' }
          ]
        },
        {
          key: 'department',
          label: 'Departamento',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'Lima', label: 'Lima' },
            { value: 'Arequipa', label: 'Arequipa' },
            { value: 'Cusco', label: 'Cusco' }
          ]
        }
      ]
    };
  }

  getStoreFilterConfig(): FilterConfig {
    return {
      searchFields: ['productName', 'productCode', 'category'],
      statusField: 'status',
      customFilters: [
        {
          key: 'status',
          label: 'Estado',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'A', label: 'Activos' },
            { value: 'I', label: 'Inactivos' }
          ]
        },
        {
          key: 'category',
          label: 'Categoría',
          type: 'select',
          options: [
            { value: '', label: 'Todas' },
            { value: 'PANADERIA', label: 'Panadería' },
            { value: 'PASTELERIA', label: 'Pastelería' },
            { value: 'BEBIDAS', label: 'Bebidas' },
            { value: 'OTROS', label: 'Otros' }
          ]
        },
        {
          key: 'stockAlert',
          label: 'Alerta de Stock',
          type: 'select',
          options: [
            { value: '', label: 'Todos' },
            { value: 'LOW', label: 'Stock Bajo' },
            { value: 'OUT', label: 'Sin Stock' },
            { value: 'OK', label: 'Stock Normal' }
          ]
        }
      ]
    };
  }
}