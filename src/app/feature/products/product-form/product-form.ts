import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { ProductsService } from '../../../core/services/products.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CustomValidators } from '../../../shared/validators/custom-validators';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  submitting = false;

  categories = [
    'Panadería',
    'Repostería',
    'Pasteles',
    'Galletas',
    'Bebidas',
    'Otros'
  ];

  units = [
    'Unidad',
    'Kilogramo',
    'Gramo',
    'Litro',
    'Mililitro',
    'Docena',
    'Paquete'
  ];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
  }

  // Propiedades para manejo de imagen
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  uploadingImage = false;

  createForm(): FormGroup {
    return this.fb.group({
      productCode: ['', [
        Validators.required,
        CustomValidators.alphanumeric(),
        Validators.minLength(3),
        Validators.maxLength(20)
      ]],
      productName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        CustomValidators.noMultipleSpaces()
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      category: ['', Validators.required],
      price: ['', [
        Validators.required,
        CustomValidators.price()
      ]],
      stock: ['', [
        Validators.required,
        CustomValidators.stock()
      ]],
      initialStock: ['', [
        Validators.required,
        CustomValidators.stock()
      ]],
      imageUrl: ['', [
        Validators.required,
        CustomValidators.imageUrl()
      ]]
    });
  }

  loadProduct(): void {
    if (!this.productId) return;

    this.loading = true;
    this.productsService.getById(this.productId).subscribe({
      next: (product: any) => {
        this.productForm.patchValue({
          productCode: product.productCode,
          productName: product.productName,
          description: product.description,
          category: product.category,
          price: product.price,
          stock: product.stock,
          initialStock: product.initialStock,
          imageUrl: product.imageUrl,
          status: product.status
        });

        // Cargar vista previa de imagen si existe
        if (product.imageUrl) {
          this.imagePreview = product.imageUrl;
        }

        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  // Método para manejar selección de archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.notificationService.error('Por favor selecciona una imagen válida (JPG, PNG, GIF, WEBP)');
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.notificationService.error('La imagen no debe superar los 5MB');
        return;
      }

      this.selectedFile = file;

      // Redimensionar y comprimir imagen antes de mostrar
      this.resizeAndCompressImage(file);
    }
  }

  // Método para redimensionar y comprimir imagen (optimizado para no congelar)
  private resizeAndCompressImage(file: File): void {
    this.uploadingImage = true;
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Usar setTimeout para no bloquear el hilo principal
      setTimeout(() => {
        const img = new Image();
        img.onload = () => {
          // Crear canvas para redimensionar
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Tamaño MUCHO más pequeño para evitar lag (máximo 400x400)
          const maxWidth = 400;
          const maxHeight = 400;
          let width = img.width;
          let height = img.height;

          // Calcular nuevas dimensiones manteniendo proporción
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Dibujar imagen redimensionada
          ctx?.drawImage(img, 0, 0, width, height);

          // Convertir a base64 con ALTA compresión (50% calidad)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
          
          // Actualizar vista previa
          this.imagePreview = compressedDataUrl;
          
          // Actualizar campo de URL con la imagen comprimida
          this.productForm.patchValue({ imageUrl: compressedDataUrl });
          
          this.uploadingImage = false;
          this.notificationService.success('Imagen cargada correctamente');
        };
        
        img.onerror = () => {
          this.uploadingImage = false;
          this.notificationService.error('Error al cargar la imagen');
        };
        
        img.src = e.target.result;
      }, 100); // Pequeño delay para no bloquear UI
    };
    
    reader.onerror = () => {
      this.uploadingImage = false;
      this.notificationService.error('Error al leer el archivo');
    };
    
    reader.readAsDataURL(file);
  }

  // Método para subir imagen (simulado - en producción usar servicio real)
  uploadImage(file: File): void {
    this.uploadingImage = true;

    // OPCIÓN 1: Usar un servicio de imágenes como Cloudinary, ImgBB, etc.
    // OPCIÓN 2: Subir al servidor backend
    // OPCIÓN 3: Usar URLs de ejemplo (para desarrollo)

    // Por ahora, usaremos URLs de ejemplo de productos de panadería
    // En producción, implementar upload real

    setTimeout(() => {
      // Generar URL de ejemplo basada en la categoría
      const category = this.productForm.get('category')?.value || 'Panadería';
      const exampleUrls: { [key: string]: string[] } = {
        'Panadería': [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
          'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500',
          'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500'
        ],
        'Repostería': [
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
          'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500',
          'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=500'
        ],
        'Pasteles': [
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
          'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500',
          'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500'
        ],
        'Galletas': [
          'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
          'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
          'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500'
        ],
        'Bebidas': [
          'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500',
          'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
          'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500'
        ]
      };

      const urls = exampleUrls[category] || exampleUrls['Panadería'];
      const randomUrl = urls[Math.floor(Math.random() * urls.length)];

      this.productForm.patchValue({ imageUrl: randomUrl });
      this.uploadingImage = false;
      this.notificationService.success('Imagen cargada exitosamente');
    }, 1000);
  }

  // Método para usar URL directa
  onImageUrlChange(): void {
    const url = this.productForm.get('imageUrl')?.value;
    if (url && url.trim()) {
      this.imagePreview = url;
    }
  }

  // Método para limpiar imagen
  clearImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.productForm.patchValue({ imageUrl: '' });
  }

  // Método para generar URL de imagen de ejemplo
  generateExampleImage(): void {
    const category = this.productForm.get('category')?.value;
    if (!category) {
      this.notificationService.warning('Primero selecciona una categoría');
      return;
    }

    const exampleUrls: { [key: string]: string[] } = {
      'Panadería': [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500',
        'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500',
        'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500'
      ],
      'Repostería': [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
        'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500',
        'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=500',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500'
      ],
      'Pasteles': [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
        'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500',
        'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500',
        'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=500'
      ],
      'Galletas': [
        'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500',
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
        'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500',
        'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=500'
      ],
      'Bebidas': [
        'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500',
        'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
        'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500'
      ],
      'Otros': [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500'
      ]
    };

    const urls = exampleUrls[category] || exampleUrls['Otros'];
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];

    this.productForm.patchValue({ imageUrl: randomUrl });
    this.imagePreview = randomUrl;
    this.notificationService.success('Imagen de ejemplo generada');
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.submitting = true;
      const productData = {
        ...this.productForm.value,
        status: 'A' // Por defecto siempre activo
      };

      const operation = this.isEditMode
        ? this.productsService.update(this.productId!, productData)
        : this.productsService.create(productData);

      operation.subscribe({
        next: () => {
          this.submitting = false;

          if (this.isEditMode) {
            this.notificationService.productUpdated(productData.productName);
          } else {
            this.notificationService.productCreated(productData.productName);
          }

          this.router.navigate(['/products']);
        },
        error: (error: any) => {
          console.error('Error saving product:', error);
          this.submitting = false;
          const operation = this.isEditMode ? 'actualizar' : 'crear';
          this.notificationService.operationError(operation, 'producto', error.error?.message);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  generateProductCode(): void {
    const timestamp = Date.now().toString().slice(-4);
    const category = this.productForm.get('category')?.value || 'GEN';
    const code = `${category.substring(0, 3).toUpperCase()}${timestamp}`;
    this.productForm.patchValue({ productCode: code });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} no puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      productCode: 'Código del producto',
      productName: 'Nombre del producto',
      description: 'Descripción',
      category: 'Categoría',
      price: 'Precio',
      stock: 'Stock actual',
      initialStock: 'Stock inicial',
      imageUrl: 'URL de la imagen'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  onCategoryChange(): void {
    if (!this.isEditMode) {
      this.generateProductCode();
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength']?.requiredLength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      return `Máximo ${field.errors?.['maxlength']?.requiredLength} caracteres`;
    }
    if (field?.hasError('min')) {
      return `El valor debe ser mayor a ${field.errors?.['min']?.min}`;
    }
    return '';
  }
}