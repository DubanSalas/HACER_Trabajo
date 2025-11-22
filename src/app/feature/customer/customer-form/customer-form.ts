import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { CustomerService } from '../../../core/services/customer.service';
import { CustomerDTO, CustomerRequest } from '../../../core/interfaces/customer-interfaces';
import { NotificationService } from '../../../core/services/notification.service';
import { LocationService } from '../../../core/services/location.service';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './customer-form.html',
  styleUrls: ['./customer-form.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  customerData: CustomerDTO | null = null;
  isEditMode = false;
  loading = false;
  customerId: number | null = null;

  documentTypes = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PAS', label: 'Pasaporte' }
  ];

  // Listas de ubicación (cargadas desde API)
  departments: string[] = [];
  availableProvinces: string[] = [];
  availableDistricts: string[] = [];
  
  selectedDepartment = 'Lima';
  selectedProvince = 'Lima';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private locationService: LocationService
  ) {
    this.customerForm = this.fb.group({
      // clientCode se genera automáticamente en el backend
      documentType: ['DNI', [Validators.required]],
      documentNumber: ['', [Validators.required], [this.documentNumberAsyncValidator.bind(this)]],
      name: ['', [Validators.required, this.nameValidator, this.noMultipleSpacesValidator]],
      surname: ['', [Validators.required, this.nameValidator, this.noMultipleSpacesValidator]],
      dateBirth: ['', [Validators.required, this.ageValidator]],
      phone: ['', [Validators.required, this.phoneValidator]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      department: ['Lima', [Validators.required]],
      province: ['Lima', [Validators.required]],
      district: ['', [Validators.required]],
      locationId: [1, [Validators.required]]
    });

    // Configurar validación dinámica del documento según el tipo
    this.customerForm.get('documentType')?.valueChanges.subscribe(type => {
      this.updateDocumentValidation(type);
    });

    // Configurar validación de unicidad de nombre y apellido
    this.customerForm.get('name')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.checkNameUniqueness();
    });

    this.customerForm.get('surname')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.checkNameUniqueness();
    });
  }

  ngOnInit(): void {
    // Calcular fecha máxima de nacimiento
    this.calculateMaxBirthDate();
    
    // Cargar departamentos desde la API
    this.loadDepartments();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.customerId = +params['id'];
        this.isEditMode = true;
        this.loadCustomer();
      } else {
        // Cargar provincias y distritos por defecto para Lima
        this.loadProvinces('Lima');
      }
    });
  }

  loadCustomer(): void {
    if (this.customerId) {
      this.loading = true;
      this.customerService.getById(this.customerId).subscribe({
        next: (customerData) => {
          this.customerData = customerData;
          
          // Mapear los datos del DTO al formulario
          this.customerForm.patchValue({
            clientCode: customerData.clientCode,
            documentType: customerData.documentType,
            documentNumber: customerData.documentNumber,
            name: customerData.name,
            surname: customerData.surname,
            dateBirth: customerData.dateBirth,
            phone: customerData.phone,
            email: customerData.email,
            address: customerData.address,
            department: customerData.department,
            province: customerData.province,
            district: customerData.district,
            locationId: customerData.locationId,
            status: customerData.status
          });

          // Cargar ubicaciones para el modo edición
          this.selectedDepartment = customerData.department;
          this.selectedProvince = customerData.province;
          
          // Cargar provincias del departamento
          if (customerData.department) {
            this.loadProvinces(customerData.department);
          }
          
          // Cargar distritos de la provincia
          if (customerData.province) {
            this.loadDistricts(customerData.province);
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading customer:', error);
          this.notificationService.error('Error al cargar el cliente');
          this.loading = false;
        }
      });
    }
  }

  // El código de cliente se genera automáticamente en el backend

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.customerForm.value;
    
    let customerData: CustomerRequest;
    
    if (this.isEditMode) {
      // En modo edición, incluir el clientCode existente
      customerData = {
        ...formValue,
        clientCode: this.customerData?.clientCode, // Usar el código existente
        status: 'A'
      };
    } else {
      // En modo creación, excluir clientCode para que el backend lo genere
      const { clientCode, ...customerDataWithoutCode } = formValue;
      customerData = {
        ...customerDataWithoutCode,
        status: 'A'
      };
    }

    const operation = this.isEditMode
      ? this.customerService.update(this.customerId!, customerData)
      : this.customerService.create(customerData);

    operation.subscribe({
      next: () => {
        this.loading = false;
        const customerName = `${customerData.name} ${customerData.surname}`;
        
        if (this.isEditMode) {
          this.notificationService.customerUpdated(customerName);
        } else {
          this.notificationService.customerCreated(customerName);
        }
        
        this.router.navigate(['/customers']);
      },
      error: (error) => {
        console.error('Error saving customer:', error);
        this.loading = false;
        const operation = this.isEditMode ? 'actualizar' : 'crear';
        this.notificationService.operationError(operation, 'cliente', error.error?.message);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }

  // Métodos para cargar ubicación desde API
  loadDepartments(): void {
    this.locationService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments.sort();
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.notificationService.error('Error al cargar los departamentos');
      }
    });
  }

  loadProvinces(department: string): void {
    if (!department) return;
    
    this.locationService.getProvincesByDepartment(department).subscribe({
      next: (provinces) => {
        this.availableProvinces = provinces.sort();
        // Si es Lima, seleccionar Lima por defecto
        if (department === 'Lima' && !this.isEditMode) {
          this.customerForm.patchValue({ province: 'Lima' });
          this.loadDistricts('Lima');
        }
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
        this.notificationService.error('Error al cargar las provincias');
      }
    });
  }

  loadDistricts(province: string): void {
    if (!province) return;
    
    this.locationService.getDistrictsByProvince(province).subscribe({
      next: (districts) => {
        this.availableDistricts = districts.sort();
      },
      error: (error) => {
        console.error('Error loading districts:', error);
        this.notificationService.error('Error al cargar los distritos');
      }
    });
  }

  // Métodos para manejar cambios en el formulario
  onDepartmentChange(): void {
    const department = this.customerForm.get('department')?.value;
    this.selectedDepartment = department;
    
    // Limpiar provincia y distrito
    this.customerForm.patchValue({
      province: '',
      district: ''
    });
    
    // Limpiar listas
    this.availableProvinces = [];
    this.availableDistricts = [];
    
    // Cargar provincias del departamento seleccionado
    if (department) {
      this.loadProvinces(department);
    }
  }

  onProvinceChange(): void {
    const province = this.customerForm.get('province')?.value;
    this.selectedProvince = province;
    
    // Limpiar distrito
    this.customerForm.patchValue({
      district: ''
    });
    
    // Limpiar lista de distritos
    this.availableDistricts = [];
    
    // Cargar distritos de la provincia seleccionada
    if (province) {
      this.loadDistricts(province);
    }
  }



  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  // VALIDADORES PERSONALIZADOS

  // Validador para nombres y apellidos (solo letras y espacios)
  nameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!namePattern.test(control.value)) {
      return { invalidName: true };
    }
    return null;
  }

  // Validador para evitar múltiples espacios consecutivos
  noMultipleSpacesValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const hasMultipleSpaces = /\s{2,}/.test(control.value);
    const startsOrEndsWithSpace = /^\s|\s$/.test(control.value);
    
    if (hasMultipleSpaces || startsOrEndsWithSpace) {
      return { multipleSpaces: true };
    }
    return null;
  }

  // Validador para edad mínima de 18 años
  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      const actualAge = age - 1;
      if (actualAge < 18) {
        return { underAge: true };
      }
    } else if (age < 18) {
      return { underAge: true };
    }
    
    return null;
  }

  // Validador para teléfono (9 dígitos, comienza con 9)
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const phonePattern = /^9\d{8}$/;
    if (!phonePattern.test(control.value)) {
      return { invalidPhone: true };
    }
    return null;
  }

  // Validador asíncrono para número de documento
  documentNumberAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) return of(null);
    
    const documentType = this.customerForm?.get('documentType')?.value;
    
    // Validar formato según tipo de documento
    const formatError = this.validateDocumentFormat(control.value, documentType);
    if (formatError) {
      return of(formatError);
    }

    // Validar unicidad (solo si no estamos en modo edición o si el documento cambió)
    if (this.isEditMode && this.customerData?.documentNumber === control.value) {
      return of(null);
    }

    return this.customerService.existsByDocumentNumber(control.value).pipe(
      map(exists => exists ? { documentExists: true } : null),
      catchError(() => of(null))
    );
  }

  // Validar formato de documento según tipo
  validateDocumentFormat(documentNumber: string, documentType: string): ValidationErrors | null {
    switch (documentType) {
      case 'DNI':
        if (!/^\d{8}$/.test(documentNumber)) {
          return { invalidDniFormat: true };
        }
        break;
      case 'CE':
        if (!/^\d{9}$/.test(documentNumber)) {
          return { invalidCeFormat: true };
        }
        break;
      case 'PAS':
        if (!/^[A-Za-z0-9]{8,12}$/.test(documentNumber)) {
          return { invalidPassportFormat: true };
        }
        break;
    }
    return null;
  }

  // Actualizar validación de documento según tipo
  updateDocumentValidation(documentType: string): void {
    const documentControl = this.customerForm.get('documentNumber');
    if (documentControl) {
      documentControl.updateValueAndValidity();
    }
  }

  // Verificar unicidad de nombre y apellido
  checkNameUniqueness(): void {
    const name = this.customerForm.get('name')?.value?.trim();
    const surname = this.customerForm.get('surname')?.value?.trim();
    
    if (!name || !surname) return;

    // Si estamos en modo edición y los nombres no cambiaron, no validar
    if (this.isEditMode && 
        this.customerData?.name === name && 
        this.customerData?.surname === surname) {
      return;
    }

    this.customerService.existsByFullName(name, surname).subscribe({
      next: (exists) => {
        const nameControl = this.customerForm.get('name');
        const surnameControl = this.customerForm.get('surname');
        
        if (exists) {
          nameControl?.setErrors({ ...nameControl.errors, nameExists: true });
          surnameControl?.setErrors({ ...surnameControl.errors, nameExists: true });
        } else {
          // Limpiar error de nombre existente pero mantener otros errores
          if (nameControl?.errors) {
            delete nameControl.errors['nameExists'];
            if (Object.keys(nameControl.errors).length === 0) {
              nameControl.setErrors(null);
            }
          }
          if (surnameControl?.errors) {
            delete surnameControl.errors['nameExists'];
            if (Object.keys(surnameControl.errors).length === 0) {
              surnameControl.setErrors(null);
            }
          }
        }
      },
      error: (error) => {
        console.error('Error checking name uniqueness:', error);
      }
    });
  }

  // Métodos auxiliares para el HTML
  getDocumentPlaceholder(): string {
    const documentType = this.customerForm.get('documentType')?.value;
    switch (documentType) {
      case 'DNI': return 'Ej: 12345678';
      case 'CE': return 'Ej: 123456789';
      case 'PAS': return 'Ej: AB123456';
      default: return 'Número de documento';
    }
  }

  getDocumentMaxLength(): number {
    const documentType = this.customerForm.get('documentType')?.value;
    switch (documentType) {
      case 'DNI': return 8;
      case 'CE': return 9;
      case 'PAS': return 12;
      default: return 12;
    }
  }

  getDocumentHint(): string {
    const documentType = this.customerForm.get('documentType')?.value;
    switch (documentType) {
      case 'DNI': return 'Exactamente 8 dígitos numéricos';
      case 'CE': return 'Exactamente 9 dígitos numéricos';
      case 'PAS': return 'Entre 8 y 12 caracteres alfanuméricos';
      default: return '';
    }
  }

  maxBirthDate!: Date;

  private calculateMaxBirthDate(): void {
    const today = new Date();
    this.maxBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  }

  // Actualizar método getErrorMessage para incluir nuevos errores
  getErrorMessage(fieldName: string): string {
    const field = this.customerForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('email')) {
      return 'Ingrese un email válido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength']?.requiredLength} caracteres`;
    }
    if (field?.hasError('invalidName')) {
      return 'Solo se permiten letras y espacios';
    }
    if (field?.hasError('multipleSpaces')) {
      return 'No se permiten espacios múltiples o al inicio/final';
    }
    if (field?.hasError('underAge')) {
      return 'Debe ser mayor de 18 años';
    }
    if (field?.hasError('invalidPhone')) {
      return 'Debe comenzar con 9 y tener exactamente 9 dígitos';
    }
    if (field?.hasError('invalidDniFormat')) {
      return 'DNI debe tener exactamente 8 dígitos';
    }
    if (field?.hasError('invalidCeFormat')) {
      return 'Carnet de Extranjería debe tener exactamente 9 dígitos';
    }
    if (field?.hasError('invalidPassportFormat')) {
      return 'Pasaporte debe tener entre 8 y 12 caracteres alfanuméricos';
    }
    if (field?.hasError('documentExists')) {
      return 'Ya existe un cliente con este número de documento';
    }
    if (field?.hasError('nameExists')) {
      return 'Ya existe un cliente con este nombre y apellido';
    }
    
    return '';
  }
}