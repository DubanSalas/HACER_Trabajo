import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../interfaces/customer-portal-interfaces';
import { ProductsService } from './products.service';
import { ProductDTO } from '../interfaces/products-interfaces';

@Injectable({
  providedIn: 'root'
})
export class CustomerProductsService {
  
  constructor(
    private productsService: ProductsService,
    private http: HttpClient
  ) {}

  /**
   * Obtiene todos los productos activos para el portal del cliente
   */
  getAvailableProducts(): Observable<Product[]> {
    return this.productsService.getByStatus('A').pipe(
      map(products => products.map(product => this.mapToCustomerProduct(product)))
    );
  }

  /**
   * Obtiene productos por categoría
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.productsService.getByCategory(category).pipe(
      map(products => products
        .filter(product => product.status === 'A' && product.stock > 0)
        .map(product => this.mapToCustomerProduct(product))
      )
    );
  }

  /**
   * Busca productos por término de búsqueda
   */
  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.productsService.search(searchTerm, 'A').pipe(
      map(products => products
        .filter(product => product.stock > 0)
        .map(product => this.mapToCustomerProduct(product))
      )
    );
  }

  /**
   * Obtiene un producto específico por ID
   */
  getProductById(id: string): Observable<Product | null> {
    return this.productsService.getById(parseInt(id)).pipe(
      map(product => {
        if (product && product.status === 'A' && product.stock > 0) {
          return this.mapToCustomerProduct(product);
        }
        return null;
      })
    );
  }

  /**
   * Obtiene productos destacados (con mayor stock)
   */
  getFeaturedProducts(limit: number = 6): Observable<Product[]> {
    return this.productsService.getByStatus('A').pipe(
      map(products => products
        .filter(product => product.stock > 0)
        .sort((a, b) => (b.stock || 0) - (a.stock || 0))
        .slice(0, limit)
        .map(product => this.mapToCustomerProduct(product))
      )
    );
  }

  /**
   * Obtiene todas las categorías disponibles
   */
  getAvailableCategories(): Observable<string[]> {
    return this.productsService.getByStatus('A').pipe(
      map(products => {
        const categories = products
          .filter(product => product.stock > 0)
          .map(product => product.category)
          .filter(category => category && category.trim() !== '');
        
        return [...new Set(categories)].sort();
      })
    );
  }

  /**
   * Convierte un ProductDTO del backend al formato Product del cliente
   */
  private mapToCustomerProduct(productDTO: ProductDTO): Product {
    return {
      id: productDTO.idProduct?.toString() || '0',
      name: productDTO.productName || 'Producto sin nombre',
      description: productDTO.description || 'Sin descripción disponible',
      price: productDTO.price || 0,
      image: this.getProductImage(productDTO),
      category: productDTO.category || 'Sin categoría',
      isAvailable: productDTO.status === 'A' && (productDTO.stock || 0) > 0,
      rating: this.generateRating(), // Generar rating aleatorio por ahora
      reviews: this.generateReviews() // Generar reviews aleatorias por ahora
    };
  }

  /**
   * Obtiene la imagen del producto o una imagen por defecto
   */
  private getProductImage(product: ProductDTO): string {
    // Si el producto tiene una imagen, usarla
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return product.imageUrl;
    }

    // Imágenes por defecto basadas en categoría
    const defaultImages: { [key: string]: string } = {
      'Pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      'Hamburguesas': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      'Pollo': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
      'Bebidas': 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400',
      'Postres': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
      'Ensaladas': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      'Pasta': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400',
      'Sushi': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'
    };

    const category = product.category || '';
    return defaultImages[category] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400';
  }

  /**
   * Genera un rating aleatorio entre 4.0 y 5.0
   */
  private generateRating(): number {
    return Math.round((Math.random() * 1 + 4) * 10) / 10;
  }

  /**
   * Genera un número aleatorio de reviews
   */
  private generateReviews(): number {
    return Math.floor(Math.random() * 200) + 10;
  }
}