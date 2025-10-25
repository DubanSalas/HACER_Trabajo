import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, ReactiveFormsModule, Validators, type FormArray } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"

@Component({
  selector: "app-sale-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule],
  templateUrl: "./sales-form.html",
  styleUrls: ["./sales-form.scss"],
})
export class SaleForm {
  private fb = inject(FormBuilder)
  private dialogRef = inject(MatDialogRef<SaleForm>)
  private data = inject(MAT_DIALOG_DATA)

  form = this.fb.group({
    cliente: ["", Validators.required],
    empleado: ["", Validators.required],
    metodoPago: ["", Validators.required],
    estado: ["", Validators.required],
    productos: this.fb.array([this.createProductoForm()]),
  })

  clientes = ["Pedro García Vázquez", "Ana Martínez López", "Carlos López"]
  empleados = ["Ana Martínez López", "Juan Pérez", "María García"]
  metodosPago = ["Efectivo", "Tarjeta", "Transferencia"]
  estados = ["Pendiente", "Completada", "Cancelada"]
  productos = ["Pan Francis", "Croissant", "Torta de Chocolate"]

  totalVenta = 0

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data)
    }
  }

  createProductoForm() {
    return this.fb.group({
      producto: ["", Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]],
    })
  }

  get productosArray(): FormArray {
    return this.form.get("productos") as FormArray
  }

  addProducto(): void {
    this.productosArray.push(this.createProductoForm())
  }

  removeProducto(index: number): void {
    this.productosArray.removeAt(index)
  }

  calculateTotal(): void {
    const productos = this.productosArray.value
    this.totalVenta = productos.reduce((sum: number, p: any) => sum + (p.cantidad * p.precio || 0), 0)
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value)
    }
  }
}
