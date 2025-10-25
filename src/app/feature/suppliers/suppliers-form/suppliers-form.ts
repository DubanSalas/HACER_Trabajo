import { Component, inject, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { SuppliersService } from "../../../core/services/suppliers.service"
import { Location, Supplier, SupplierFormData } from "../../../core/interfaces/suppliers-interfaces"
import Swal from 'sweetalert2'

@Component({
  selector: "app-supplier-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule],
  templateUrl: "./suppliers-form.html",
  styleUrls: ["./suppliers-form.scss"],
})
export class SupplierForm implements OnInit {
  private fb = inject(FormBuilder)
  private dialogRef = inject(MatDialogRef<SupplierForm>)
  private data = inject(MAT_DIALOG_DATA)
  private suppliersService = inject(SuppliersService)

  form = this.fb.group({
    Company_Name: ["", Validators.required],
    Contact_Name: ["", Validators.required],
    Phone: ["", [Validators.required, Validators.pattern(/^\d{9}$/)]],
    Email: ["", [Validators.required, Validators.email]],
    Address: ["", Validators.required],
    Category: ["", Validators.required],
    Payment_Terms: ["", Validators.required],
    id_Location: [null as number | null, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    unitPrice: [0, [Validators.required, Validators.min(0)]],
    subtotal: [0, [Validators.required, Validators.min(0)]],
    total: [0, [Validators.required, Validators.min(0)]]
  })

  categories = [
    "Harinas y Cereales", 
    "Dulces y Chocolates", 
    "Lácteos", 
    "Frutas y Verduras", 
    "Servicios",
    "Endulzantes",
    "Productos Lácteos"
  ]

  paymentTerms = [
    "15 Días",
    "30 Días", 
    "45 Días",
    "60 Días",
    "Al contado"
  ]

  locations: Location[] = []
  supplier: Supplier | null = null
  isEditMode = false

  ngOnInit(): void {
    if (this.data) {
      this.locations = this.data.locations || []
      this.supplier = this.data.supplier || null
      this.isEditMode = !!this.supplier

      if (this.supplier) {
        this.form.patchValue({
          Company_Name: this.supplier.Company_Name,
          Contact_Name: this.supplier.Contact_Name,
          Phone: this.supplier.Phone,
          Email: this.supplier.Email,
          Address: this.supplier.Address,
          Category: this.supplier.Category,
          Payment_Terms: this.supplier.Payment_Terms,
          id_Location: this.supplier.id_Location
        })
      }
    }

    // Calcular subtotal y total cuando cambien cantidad o precio
    this.form.get('quantity')?.valueChanges.subscribe(() => this.calculateSubtotal())
    this.form.get('unitPrice')?.valueChanges.subscribe(() => this.calculateSubtotal())
  }

  calculateSubtotal(): void {
    const quantity = this.form.get('quantity')?.value || 0
    const unitPrice = this.form.get('unitPrice')?.value || 0
    const subtotal = quantity * unitPrice
    
    this.form.patchValue({
      subtotal: subtotal,
      total: subtotal
    }, { emitEvent: false })
  }

  getLocationDisplay(location: Location): string {
    return `${location.district}, ${location.province}, ${location.department}`
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData: SupplierFormData = {
        Company_Name: this.form.value.Company_Name!,
        Contact_Name: this.form.value.Contact_Name!,
        Phone: this.form.value.Phone!,
        Email: this.form.value.Email!,
        Address: this.form.value.Address!,
        Category: this.form.value.Category!,
        Payment_Terms: this.form.value.Payment_Terms!,
        id_Location: this.form.value.id_Location!,
        Status: 'A'
      }

      if (this.isEditMode && this.supplier?.id_Supplier) {
        this.suppliersService.updateSupplier(this.supplier.id_Supplier, formData).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Proveedor actualizado correctamente', 'success')
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error('Error updating supplier:', error)
            Swal.fire('Error', 'No se pudo actualizar el proveedor', 'error')
          }
        })
      } else {
        this.suppliersService.createSupplier(formData).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Proveedor creado correctamente', 'success')
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error('Error creating supplier:', error)
            Swal.fire('Error', 'No se pudo crear el proveedor', 'error')
          }
        })
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched()
      })
    }
  }
}
