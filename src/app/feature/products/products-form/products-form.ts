import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProductsService } from "../../../core/services/products.service";
import { Product, ProductFormData } from "../../../core/interfaces/products-interfaces";
import Swal from 'sweetalert2';

@Component({
  selector: "app-product-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: "./products-form.html",
  styleUrls: ["./products-form.scss"],
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProductForm>);
  private data = inject(MAT_DIALOG_DATA);
  private productsService = inject(ProductsService);

  form = this.fb.group({
    Product_Name: ["", Validators.required],
    Category: ["", Validators.required],
    Description: ["", Validators.required],
    Price: [0, [Validators.required, Validators.min(0.01)]],
    Initial_Stock: [0, [Validators.required, Validators.min(0)]],
    Image_Url: [""]
  });

  categories: string[] = [
    "Panadería", 
    "Repostería", 
    "Bebidas", 
    "Lácteos", 
    "Frutas y Verduras",
    "Dulces y Chocolates"
  ];
  
  product: Product | null = null;
  isEditMode = false;
  totalStockValue = 0;

  ngOnInit(): void {
    if (this.data) {
      this.categories = this.data.categories || this.categories;
      this.product = this.data.product || null;
      this.isEditMode = !!this.product;

      if (this.product) {
        this.form.patchValue({
          Product_Name: this.product.Product_Name,
          Category: this.product.Category,
          Description: this.product.Description,
          Price: this.product.Price,
          Initial_Stock: this.product.Initial_Stock,
          Image_Url: this.product.Image_Url || ""
        });
      }
    }

    // Calcular valor total cuando cambien precio o stock
    this.form.get("Price")?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    this.form.get("Initial_Stock")?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    // Calcular inicial
    this.calculateTotal();
  }

  calculateTotal(): void {
    const price = this.form.get("Price")?.value || 0;
    const stock = this.form.get("Initial_Stock")?.value || 0;
    this.totalStockValue = price * stock;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData: ProductFormData = {
        Product_Code: this.generateProductCode(),
        Product_Name: this.form.value.Product_Name!,
        Category: this.form.value.Category!,
        Description: this.form.value.Description!,
        Price: this.form.value.Price!,
        Stock: this.form.value.Initial_Stock!,
        Initial_Stock: this.form.value.Initial_Stock!,
        Image_Url: this.form.value.Image_Url || "",
        Status: 'A'
      };

      if (this.isEditMode && this.product?.id_Product) {
        this.productsService.updateProduct(this.product.id_Product, formData).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating product:', error);
            Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
          }
        });
      } else {
        this.productsService.createProduct(formData).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Producto creado correctamente', 'success');
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating product:', error);
            Swal.fire('Error', 'No se pudo crear el producto', 'error');
          }
        });
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  private generateProductCode(): string {
    // Generar código de producto automáticamente
    const prefix = this.form.value.Category?.substring(0, 2).toUpperCase() || 'PR';
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}${timestamp}`;
  }
}
