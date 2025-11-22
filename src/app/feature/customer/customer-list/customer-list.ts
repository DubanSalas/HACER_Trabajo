import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, startWith, combineLatest } from 'rxjs';
import { CustomerService } from '../../../core/services/customer.service';
import { CustomerDTO, CustomerSummary } from '../../../core/interfaces/customer-interfaces';
import { NotificationService } from '../../../core/services/notification.service';
import { FilterService, FilterConfig } from '../../../core/services/filter.service';
import { AdvancedFilterComponent } from '../../../shared/components/advanced-filter/advanced-filter.component';

interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, AdvancedFilterComponent],
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Data properties
  customers: CustomerDTO[] = [];
  filteredCustomers: CustomerDTO[] = [];
  paginatedCustomers: CustomerDTO[] = [];
  summary: CustomerSummary | null = null;
  
  // State properties
  isLoading = false;
  errorMessage = '';
  
  // Detail modal properties
  showDetailModal = false;
  selectedCustomer: CustomerDTO | null = null;
  
  // Form and filters
  filtersForm: FormGroup;
  filterConfig: FilterConfig;
  
  // Sorting
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Pagination
  paginationInfo: PaginationInfo = {
    currentPage: 1,
    itemsPerPage: 25,
    totalItems: 0,
    totalPages: 0,
    startIndex: 0,
    endIndex: 0
  };

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private filterService: FilterService
  ) {
    this.filtersForm = this.fb.group({
      searchTerm: [''],
      status: [''],
      department: [''],
      documentType: [''],
      itemsPerPage: [25]
    });
    
    // Inicializar configuración de filtros
    this.filterConfig = this.filterService.getCustomerFilterConfig();
  }

  ngOnInit() {
    this.setupFormSubscriptions();
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFormSubscriptions() {
    // Search term with debounce
    this.filtersForm.get('searchTerm')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilters();
    });

    // Other filters
    combineLatest([
      this.filtersForm.get('status')?.valueChanges.pipe(startWith('')) || [],
      this.filtersForm.get('department')?.valueChanges.pipe(startWith('')) || [],
      this.filtersForm.get('documentType')?.valueChanges.pipe(startWith('')) || [],
      this.filtersForm.get('itemsPerPage')?.valueChanges.pipe(startWith(25)) || []
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.paginationInfo.itemsPerPage = this.filtersForm.get('itemsPerPage')?.value || 25;
      this.paginationInfo.currentPage = 1;
      this.applyFilters();
    });
  }

  loadData() {
    this.isLoading = true;
    this.errorMessage = '';

    // Load customers and summary in parallel
    combineLatest([
      this.customerService.getAll(),
      this.customerService.getSummary()
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([customers, summary]) => {
        console.log('✅ Customers loaded:', customers.length);
        console.log('✅ Summary loaded:', summary);
        
        this.customers = customers;
        this.summary = summary;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading customers:', error);
        this.errorMessage = 'Error al cargar los clientes. Verifica la conexión con el servidor.';
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    // Usar el FilterService para aplicar filtros
    this.filteredCustomers = this.filterService.applyFilters(this.customers, this.filterConfig);
    this.updatePagination();
  }

  // Método para manejar cambios en filtros avanzados
  onFiltersChanged(event: any): void {
    this.paginationInfo.currentPage = 1;
    this.applyFilters();
  }

  updatePagination() {
    this.paginationInfo.totalItems = this.filteredCustomers.length;
    this.paginationInfo.totalPages = Math.ceil(this.paginationInfo.totalItems / this.paginationInfo.itemsPerPage);
    
    // Ensure current page is valid
    if (this.paginationInfo.currentPage > this.paginationInfo.totalPages) {
      this.paginationInfo.currentPage = Math.max(1, this.paginationInfo.totalPages);
    }
    
    this.paginationInfo.startIndex = (this.paginationInfo.currentPage - 1) * this.paginationInfo.itemsPerPage;
    this.paginationInfo.endIndex = Math.min(
      this.paginationInfo.startIndex + this.paginationInfo.itemsPerPage,
      this.paginationInfo.totalItems
    );
    
    // Apply sorting before pagination
    this.applySorting();
    
    // Get paginated data
    this.paginatedCustomers = this.filteredCustomers.slice(
      this.paginationInfo.startIndex,
      this.paginationInfo.endIndex
    );
  }

  applySorting() {
    if (this.sortField) {
      this.filteredCustomers.sort((a, b) => {
        let aValue = this.getNestedProperty(a, this.sortField);
        let bValue = this.getNestedProperty(b, this.sortField);
        
        // Handle different data types
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj) || '';
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.updatePagination();
  }

  getSortClass(field: string): string {
    if (this.sortField === field) {
      return this.sortDirection;
    }
    return '';
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.paginationInfo.totalPages) {
      this.paginationInfo.currentPage = page;
      this.updatePagination();
    }
  }

  getVisiblePages(): number[] {
    const totalPages = this.paginationInfo.totalPages;
    const currentPage = this.paginationInfo.currentPage;
    const visiblePages: number[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          visiblePages.push(i);
        }
        visiblePages.push(-1); // Ellipsis
        visiblePages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        visiblePages.push(1);
        visiblePages.push(-1); // Ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        visiblePages.push(1);
        visiblePages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push(-1); // Ellipsis
        visiblePages.push(totalPages);
      }
    }
    
    return visiblePages.filter(page => page !== -1);
  }

  // Utility methods
  clearSearch() {
    this.filtersForm.patchValue({ searchTerm: '' });
  }

  clearFilters() {
    this.filtersForm.reset({
      searchTerm: '',
      status: '',
      department: '',
      documentType: '',
      itemsPerPage: 25
    });
  }

  refreshData() {
    this.loadData();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  }

  getStatusText(status: string): string {
    return status === 'A' ? 'Activo' : 'Inactivo';
  }

  getStatusClass(status: string): string {
    return status === 'A' ? 'active' : 'inactive';
  }

  getDocumentTypeClass(documentType: string): string {
    return documentType;
  }

  // Navigation methods
  navigateToCreate() {
    this.router.navigate(['/customers/create']);
  }

  viewCustomer(id: number) {
    const customer = this.customers.find(c => c.idCustomer === id);
    if (customer) {
      this.selectedCustomer = customer;
      this.showDetailModal = true;
    }
  }

  editCustomer(id: number) {
    this.router.navigate(['/customers/edit', id]);
  }

  deleteCustomer(id: number, customerName: string) {
    if (confirm(`¿Estás seguro de que deseas desactivar al cliente "${customerName}"?\n\nEl cliente pasará a estado INACTIVO y podrás reactivarlo después.`)) {
      this.isLoading = true;
      this.customerService.delete(id).subscribe({
        next: () => {
          console.log('✅ Customer deactivated successfully');
          this.notificationService.customerDeactivated(customerName);
          // Recargar datos y forzar actualización
          this.loadData();
          // Limpiar filtros para mostrar todos los estados
          setTimeout(() => {
            this.filtersForm.patchValue({ status: '' });
            this.isLoading = false;
          }, 500);
        },
        error: (error) => {
          console.error('❌ Error deactivating customer:', error);
          this.notificationService.operationError('desactivar', 'cliente', error.error?.message);
          this.isLoading = false;
        }
      });
    }
  }

  restoreCustomer(id: number, customerName: string) {
    if (confirm(`¿Estás seguro de que deseas reactivar al cliente "${customerName}"?\n\nEl cliente volverá a estado ACTIVO.`)) {
      this.isLoading = true;
      this.customerService.restore(id).subscribe({
        next: () => {
          console.log('✅ Customer restored successfully');
          this.notificationService.customerRestored(customerName);
          // Recargar datos y forzar actualización
          this.loadData();
          // Limpiar filtros para mostrar todos los estados
          setTimeout(() => {
            this.filtersForm.patchValue({ status: '' });
            this.isLoading = false;
          }, 500);
        },
        error: (error) => {
          console.error('❌ Error restoring customer:', error);
          this.notificationService.operationError('reactivar', 'cliente', error.error?.message);
          this.isLoading = false;
        }
      });
    }
  }

  generateReport() {
    this.customerService.generatePdfReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_clientes_${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('❌ Error generating report:', error);
        alert('Error al generar el reporte PDF');
      }
    });
  }

  // Additional action methods
  sendEmail(customer: CustomerDTO) {
    if (customer.email) {
      window.open(`mailto:${customer.email}?subject=Contacto desde DeliciousBakery`, '_blank');
    }
  }

  callPhone(customer: CustomerDTO) {
    if (customer.phone) {
      window.open(`tel:${customer.phone}`, '_blank');
    }
  }

  generateCustomerReport(customer: CustomerDTO) {
    console.log('Generating individual report for customer:', customer);
    // TODO: Implementar reporte individual del cliente
    alert(`Generando reporte para ${customer.name} ${customer.surname}`);
  }

  // Detail modal methods
  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedCustomer = null;
  }

  getCustomerInitials(customer: CustomerDTO): string {
    const firstName = customer.name.charAt(0).toUpperCase();
    const lastName = customer.surname.charAt(0).toUpperCase();
    return firstName + lastName;
  }

  getDocumentTypeText(documentType: string): string {
    switch (documentType) {
      case 'DNI': return 'Documento Nacional de Identidad';
      case 'CE': return 'Carnet de Extranjería';
      case 'PASSPORT': return 'Pasaporte';
      default: return documentType;
    }
  }

  editFromModal() {
    if (this.selectedCustomer && this.selectedCustomer.idCustomer) {
      this.closeDetailModal();
      this.editCustomer(this.selectedCustomer.idCustomer);
    }
  }

  deleteFromModal() {
    if (this.selectedCustomer && this.selectedCustomer.idCustomer) {
      this.deleteCustomer(this.selectedCustomer.idCustomer, `${this.selectedCustomer.name} ${this.selectedCustomer.surname}`);
      this.closeDetailModal();
    }
  }

  restoreFromModal() {
    if (this.selectedCustomer && this.selectedCustomer.idCustomer) {
      this.restoreCustomer(this.selectedCustomer.idCustomer, `${this.selectedCustomer.name} ${this.selectedCustomer.surname}`);
      this.closeDetailModal();
    }
  }
}