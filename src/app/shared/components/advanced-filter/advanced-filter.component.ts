import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { FilterService, FilterOption, FilterConfig } from '../../../core/services/filter.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-advanced-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  animations: [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0 })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out'))
    ])
  ],
  template: `
    <div class="advanced-filter-container">
      <!-- Header con búsqueda principal -->
      <div class="filter-header">
        <form [formGroup]="filterForm">
          <div class="search-container">
            <mat-form-field appearance="outline" class="main-search">
              <mat-label>{{ searchPlaceholder }}</mat-label>
              <input matInput formControlName="searchTerm" [placeholder]="searchPlaceholder">
              <mat-icon matPrefix class="search-icon">search</mat-icon>
              <button *ngIf="filterForm.get('searchTerm')?.value" mat-icon-button matSuffix (click)="clearSearch()" class="clear-btn">
                <mat-icon>close</mat-icon>
              </button>
            </mat-form-field>
          </div>
        </form>
        
        <div class="filter-controls">
          <button mat-stroked-button (click)="toggleExpanded()" class="expand-btn">
            <mat-icon>{{ expanded ? 'expand_less' : 'tune' }}</mat-icon>
            {{ expanded ? 'Menos Filtros' : 'Más Filtros' }}
          </button>
          <span class="filter-badge" *ngIf="activeFiltersCount > 0">
            {{ activeFiltersCount }}
          </span>
        </div>
      </div>

      <!-- Filtros rápidos siempre visibles -->
      <div class="quick-filters-bar" *ngIf="showStatusFilter">
        <form [formGroup]="filterForm">
          <mat-chip-listbox formControlName="status" class="status-chips">
            <mat-chip-option value="" selected>
              <mat-icon>list</mat-icon>
              Todos
            </mat-chip-option>
            <mat-chip-option *ngFor="let option of statusOptions" [value]="option.value">
              <mat-icon>{{ getStatusIcon(option.value) }}</mat-icon>
              {{ option.label }}
            </mat-chip-option>
          </mat-chip-listbox>
        </form>
      </div>

      <!-- Panel de filtros avanzados expandible -->
      <div class="advanced-filters-panel" [class.expanded]="expanded" [@slideInOut]="expanded ? 'in' : 'out'">
        <form [formGroup]="filterForm" class="filters-form">
          <!-- Filtros organizados por categorías -->
          <div class="filters-categories" *ngIf="config?.customFilters?.length">
            
            <!-- Filtros de Selección -->
            <div class="filter-category" *ngIf="hasFilterType('select')">
              <div class="category-header">
                <mat-icon>list</mat-icon>
                <h4>Categorías</h4>
              </div>
              <div class="category-content">
                <ng-container *ngFor="let filter of config?.customFilters">
                  <mat-form-field *ngIf="filter?.type === 'select'" appearance="outline" class="filter-field">
                    <mat-label>{{ filter.label || 'Filtro' }}</mat-label>
                    <mat-select [formControlName]="filter.key || ''" [multiple]="filter.multiple || false">
                      <mat-option value="">Todos</mat-option>
                      <mat-option *ngFor="let option of filter.options || []" [value]="option.value || ''">
                        {{ option.label || option.value || 'Opción' }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                </ng-container>
              </div>
            </div>

            <!-- Filtros de Fecha -->
            <div class="filter-category" *ngIf="hasFilterType('dateRange')">
              <div class="category-header">
                <mat-icon>date_range</mat-icon>
                <h4>Fechas</h4>
              </div>
              <div class="category-content">
                <ng-container *ngFor="let filter of config?.customFilters">
                  <div *ngIf="filter?.type === 'dateRange'" class="date-range-filter">
                    <mat-form-field appearance="outline" class="filter-field">
                      <mat-label>{{ filter.label || 'Fecha' }} - Desde</mat-label>
                      <input matInput [matDatepicker]="startPicker" [formControlName]="(filter.key || '') + '_start'">
                      <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
                      <mat-datepicker #startPicker></mat-datepicker>
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="filter-field">
                      <mat-label>{{ filter.label || 'Fecha' }} - Hasta</mat-label>
                      <input matInput [matDatepicker]="endPicker" [formControlName]="(filter.key || '') + '_end'">
                      <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
                      <mat-datepicker #endPicker></mat-datepicker>
                    </mat-form-field>
                  </div>
                </ng-container>
              </div>
            </div>

            <!-- Filtros Numéricos -->
            <div class="filter-category" *ngIf="hasFilterType('number')">
              <div class="category-header">
                <mat-icon>numbers</mat-icon>
                <h4>Filtros Numéricos</h4>
              </div>
              <div class="category-content">
                <ng-container *ngFor="let filter of config?.customFilters">
                  <mat-form-field *ngIf="filter?.type === 'number'" appearance="outline" class="filter-field">
                    <mat-label>{{ filter.label || 'Número' }}</mat-label>
                    <input matInput type="number" [formControlName]="filter.key || ''" [placeholder]="filter.placeholder || ''">
                    <mat-icon matPrefix>tag</mat-icon>
                  </mat-form-field>
                </ng-container>
              </div>
            </div>

            <!-- Filtros Booleanos -->
            <div class="filter-category" *ngIf="hasFilterType('boolean')">
              <div class="category-header">
                <mat-icon>toggle_on</mat-icon>
                <h4>Opciones</h4>
              </div>
              <div class="category-content">
                <ng-container *ngFor="let filter of config?.customFilters">
                  <div *ngIf="filter?.type === 'boolean'" class="boolean-filter-item">
                    <mat-slide-toggle [formControlName]="filter.key || ''" class="filter-toggle">
                      <div class="toggle-content">
                        <mat-icon>{{ filterForm.get(filter.key || '')?.value ? 'check_box' : 'check_box_outline_blank' }}</mat-icon>
                        <span>{{ filter.label || 'Opción' }}</span>
                      </div>
                    </mat-slide-toggle>
                  </div>
                </ng-container>
              </div>
            </div>
          </div>

          <!-- Acciones del Panel -->
          <div class="panel-actions">
            <button mat-flat-button color="primary" type="button" (click)="applyFilters()" class="apply-btn">
              <mat-icon>done</mat-icon>
              Aplicar Filtros
            </button>
            <button mat-stroked-button type="button" (click)="clearAllFilters()" class="clear-btn">
              <mat-icon>refresh</mat-icon>
              Limpiar Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .advanced-filter-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 24px;
      overflow: hidden;
    }

    .filter-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .search-container {
      flex: 1;
    }

    .main-search {
      width: 100%;
    }

    .main-search ::ng-deep .mat-mdc-form-field-outline {
      color: rgba(255,255,255,0.3) !important;
    }

    .main-search ::ng-deep .mat-mdc-form-field-label {
      color: rgba(255,255,255,0.8) !important;
    }

    .main-search ::ng-deep .mat-mdc-input-element {
      color: white !important;
    }

    .search-icon {
      color: rgba(255,255,255,0.7);
    }

    .filter-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
    }

    .expand-btn {
      color: white;
      border-color: rgba(255,255,255,0.3);
    }

    .filter-badge {
      background: #ff4081;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      position: absolute;
      top: -8px;
      right: -8px;
    }

    .quick-filters-bar {
      padding: 16px 24px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }

    .status-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .advanced-filters-panel {
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .advanced-filters-panel:not(.expanded) {
      height: 0;
    }

    .filters-form {
      padding: 24px;
    }

    .filters-categories {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .filter-category {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      color: #495057;
    }

    .category-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
    }

    .category-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .filter-field {
      width: 100%;
    }

    .date-range-filter {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .boolean-filter-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
    }

    .filter-toggle {
      width: 100%;
    }

    .toggle-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .panel-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e9ecef;
    }

    .apply-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    @media (max-width: 768px) {
      .filter-header {
        flex-direction: column;
        gap: 12px;
      }

      .category-content {
        grid-template-columns: 1fr;
      }

      .date-range-filter {
        grid-template-columns: 1fr;
      }

      .panel-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdvancedFilterComponent implements OnInit, OnDestroy {
  @Input() config!: FilterConfig;
  @Input() searchPlaceholder = 'Buscar...';
  @Input() showStatusFilter = true;
  @Input() statusOptions: { value: string; label: string }[] = [
    { value: 'A', label: 'Activos' },
    { value: 'I', label: 'Inactivos' }
  ];
  @Output() filtersChanged = new EventEmitter<any>();

  filterForm!: FormGroup;
  expanded = false;
  activeFiltersCount = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    const formControls: any = {
      searchTerm: [''],
      status: ['']
    };

    // Agregar controles para filtros personalizados
    if (this.config?.customFilters) {
      this.config.customFilters?.forEach(filter => {
        const key = filter.key || '';
        if (filter?.type === 'dateRange') {
          formControls[key + '_start'] = [''];
          formControls[key + '_end'] = [''];
        } else {
          formControls[key] = [''];
        }
      });
    }

    this.filterForm = this.fb.group(formControls);
  }

  private setupFormSubscriptions(): void {
    // Suscribirse a cambios en el término de búsqueda
    this.filterForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.emitFilters();
      });

    // Suscribirse a cambios en el estado
    this.filterForm.get('status')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.emitFilters();
      });

    // Suscribirse a cambios en filtros personalizados
    if (this.config?.customFilters) {
      this.config.customFilters.forEach(filter => {
        const key = filter.key || '';
        if (filter?.type === 'dateRange') {
          this.filterForm.get(key + '_start')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.emitFilters());
          
          this.filterForm.get(key + '_end')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.emitFilters());
        } else {
          this.filterForm.get(key)?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.emitFilters());
        }
      });
    }
  }

  private emitFilters(): void {
    const formValue = this.filterForm.value;
    this.updateActiveFiltersCount();
    this.filtersChanged.emit(formValue);
  }

  private updateActiveFiltersCount(): void {
    const formValue = this.filterForm.value;
    let count = 0;

    // Contar filtros activos
    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value && value !== '' && value !== null && value !== undefined) {
        if (Array.isArray(value) && value.length > 0) {
          count++;
        } else if (!Array.isArray(value)) {
          count++;
        }
      }
    });

    this.activeFiltersCount = count;
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  clearSearch(): void {
    this.filterForm.patchValue({ searchTerm: '' });
  }

  clearAllFilters(): void {
    this.filterForm.reset();
    this.filterForm.patchValue({
      searchTerm: '',
      status: ''
    });
  }

  applyFilters(): void {
    this.emitFilters();
    this.expanded = false;
  }

  hasFilterType(type: string): boolean {
    return this.config?.customFilters?.some(filter => filter?.type === type) || false;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Completado':
        return 'check_circle';
      case 'Pendiente':
        return 'schedule';
      case 'Cancelado':
        return 'cancel';
      case 'A':
        return 'check_circle';
      case 'I':
        return 'cancel';
      default:
        return 'help';
    }
  }
}