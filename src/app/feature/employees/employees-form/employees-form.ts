import { Component, inject, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { EmployeesService } from "../../../core/services/employees.service"
import { Employee, Position, Location, EmployeeFormData } from "../../../core/interfaces/employees-interfaces"
import Swal from 'sweetalert2'

@Component({
  selector: "app-employee-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: "./employees-form.html",
  styleUrls: ["./employees-form.scss"],
})
export class EmployeeForm implements OnInit {
  private fb = inject(FormBuilder)
  private dialogRef = inject(MatDialogRef<EmployeeForm>)
  private data = inject(MAT_DIALOG_DATA)
  private employeesService = inject(EmployeesService)

  form = this.fb.group({
    Employee_Code: ["", Validators.required],
    Document_Type: ["", Validators.required],
    Document_Number: ["", [Validators.required, Validators.pattern(/^\d{8}$/)]],
    Name: ["", Validators.required],
    Surname: ["", Validators.required],
    Hire_Date: [new Date(), Validators.required],
    Phone: ["", [Validators.required, Validators.pattern(/^\d{9}$/)]],
    id_Location: [null as number | null, Validators.required],
    Salary: [0, [Validators.required, Validators.min(1)]],
    Email: ["", [Validators.required, Validators.email]],
    id_Position: [null as number | null, Validators.required]
  })

  documentTypes = [
    "DNI", 
    "CEX", 
    "PAS"
  ]

  positions: Position[] = []
  locations: Location[] = []
  employee: Employee | null = null
  isEditMode = false

  ngOnInit(): void {
    if (this.data) {
      this.positions = this.data.positions || []
      this.locations = this.data.locations || []
      this.employee = this.data.employee || null
      this.isEditMode = !!this.employee

      if (this.employee) {
        this.form.patchValue({
          Employee_Code: this.employee.Employee_Code,
          Document_Type: this.employee.Document_Type,
          Document_Number: this.employee.Document_Number,
          Name: this.employee.Name,
          Surname: this.employee.Surname,
          Hire_Date: new Date(this.employee.Hire_Date),
          Phone: this.employee.Phone,
          id_Location: this.employee.id_Location,
          Salary: this.employee.Salary,
          Email: this.employee.Email,
          id_Position: this.employee.id_Position
        })
      }
    }
  }

  getLocationDisplay(location: Location): string {
    return `${location.district}, ${location.province}, ${location.department}`
  }

  getPositionDisplay(position: Position): string {
    return position.Position_Name
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData: EmployeeFormData = {
        Employee_Code: this.form.value.Employee_Code!,
        Document_Type: this.form.value.Document_Type!,
        Document_Number: this.form.value.Document_Number!,
        Name: this.form.value.Name!,
        Surname: this.form.value.Surname!,
        Hire_Date: this.form.value.Hire_Date!,
        Phone: this.form.value.Phone!,
        id_Location: this.form.value.id_Location!,
        Salary: this.form.value.Salary!,
        Email: this.form.value.Email!,
        id_Position: this.form.value.id_Position!,
        Status: 'A'
      }

      if (this.isEditMode && this.employee?.id_Employee) {
        this.employeesService.updateEmployee(this.employee.id_Employee, formData).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Empleado actualizado correctamente', 'success')
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error('Error updating employee:', error)
            Swal.fire('Error', 'No se pudo actualizar el empleado', 'error')
          }
        })
      } else {
        this.employeesService.createEmployee(formData).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Empleado creado correctamente', 'success')
            this.dialogRef.close(true)
          },
          error: (error) => {
            console.error('Error creating employee:', error)
            Swal.fire('Error', 'No se pudo crear el empleado', 'error')
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
