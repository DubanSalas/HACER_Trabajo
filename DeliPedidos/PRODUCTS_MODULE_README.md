# Módulo de Gestión de Productos

## Descripción
Este módulo implementa la gestión completa de productos para el sistema DeliPedidos, siguiendo exactamente el diseño proporcionado y conectándose con el backend Oracle.

## Características Implementadas

### 🎨 Diseño
- ✅ Interfaz idéntica al diseño proporcionado
- ✅ Formulario modal con fondo granate (#7c1d3b)
- ✅ Cards de estadísticas con iconos coloridos (6 cards en total)
- ✅ Sección de "Productos con Mayor Stock" con cards numerados
- ✅ Tabla responsive con acciones (editar, ver, eliminar)
- ✅ Filtros por categoría, estado y ordenamiento
- ✅ Toggle de vista (lista/grid)
- ✅ Búsqueda en tiempo real

### 🔧 Funcionalidades
- ✅ CRUD completo de productos
- ✅ Validación de formularios
- ✅ Alertas con SweetAlert2
- ✅ Filtros y búsqueda avanzada
- ✅ Estadísticas dinámicas (total, disponibles, stock bajo, sin stock, valor total, precio promedio)
- ✅ Top 4 productos con mayor stock
- ✅ Cálculo automático de valor total del stock
- ✅ Generación de reportes PDF
- ✅ Manejo de imágenes de productos

### 🌐 Conexión Backend
- ✅ Servicio configurado para conectar con backend en `localhost:8085`
- ✅ Endpoints siguiendo el patrón `/v1/api/product`
- ✅ Manejo de errores robusto
- ✅ Soporte para reportes PDF

## Estructura de Archivos

```
src/app/
├── core/
│   ├── interfaces/
│   │   └── products-interfaces.ts      # Interfaces basadas en BD Oracle
│   ├── services/
│   │   └── products.service.ts         # Servicio principal
├── feature/products/
│   ├── products-list/
│   │   ├── products-list.ts           # Componente principal
│   │   ├── products-list.html         # Template
│   │   └── products-list.scss         # Estilos
│   └── products-form/
│       ├── products-form.ts           # Formulario modal
│       ├── products-form.html         # Template del formulario
│       └── products-form.scss         # Estilos del formulario
```

## Endpoints del Backend

El servicio está configurado para conectarse a los siguientes endpoints:

### Productos
- `GET /v1/api/product/all` - Obtener todos los productos
- `GET /v1/api/product/status/{status}` - Filtrar por estado (A/I)
- `GET /v1/api/product/{id}` - Obtener producto por ID
- `POST /v1/api/product/save` - Crear nuevo producto
- `PUT /v1/api/product/update/{id}` - Actualizar producto
- `DELETE /v1/api/product/delete/{id}` - Eliminar producto
- `PUT /v1/api/product/restore/{id}` - Restaurar producto
- `GET /v1/api/product/pdf` - Generar reporte PDF
- `GET /v1/api/product/categories` - Obtener categorías
- `GET /v1/api/product/category/{category}` - Filtrar por categoría
- `GET /v1/api/product/low-stock` - Productos con stock bajo
- `GET /v1/api/product/out-of-stock` - Productos sin stock

## Estructura de Datos

### Product (Basado en tabla Oracle)
```typescript
interface Product {
  id_Product?: number
  Product_Code: string
  Product_Name: string
  Category: string
  Description: string
  Price: number
  Stock: number
  Initial_Stock: number
  Image_Url?: string
  Status: string  // 'A' = Activo, 'I' = Inactivo
}
```

## Configuración

### 1. Environment
Asegúrate de que `src/environments/environment.ts` tenga:
```typescript
export const environment = {
  production: false,
  urlBackEnd: 'http://localhost:8085'
};
```

### 2. Dependencias
El módulo usa las siguientes dependencias (ya incluidas):
- Angular Material
- SweetAlert2
- RxJS

## Uso

### Navegación
El módulo está disponible en la ruta `/products` y se carga de forma lazy.

### Uso con Backend
Para usar el módulo, asegúrate de que tu backend esté corriendo en `localhost:8085` con los endpoints mencionados.

## Características del Diseño

### Colores
- Fondo principal: `#f8f9fa`
- Formulario modal: `#7c1d3b` (granate)
- Botón principal: `#7c3aed` (morado)
- Estados:
  - Disponible: `#10b981` (verde)
  - Stock Bajo: `#f59e0b` (naranja)
  - Sin Stock: `#ef4444` (rojo)

### Cards de Estadísticas (6 cards)
1. **Total Productos**: Azul (`#3b82f6`) - Icono: inventory_2
2. **Disponibles**: Verde (`#10b981`) - Icono: check_circle
3. **Stock Bajo**: Naranja (`#f59e0b`) - Icono: warning
4. **Sin Stock**: Rojo (`#ef4444`) - Icono: shopping_cart
5. **Valor Total**: Morado (`#8b5cf6`) - Icono: account_balance_wallet
6. **Precio Promedio**: Azul claro (`#06b6d4`) - Icono: trending_up

### Productos con Mayor Stock
- Cards numerados con fondo rosa claro
- Números en círculos rojos (#dc2626)
- Información de stock para cada producto

### Responsive
- Diseño completamente responsive
- Grid adaptativo para cards
- Tabla responsive con scroll horizontal en móviles

## Validaciones del Formulario

- **Nombre del Producto**: Requerido
- **Categoría**: Requerida
- **Descripción**: Requerida
- **Precio**: Requerido, mayor a 0.01
- **Stock Inicial**: Requerido, mayor o igual a 0
- **Imagen**: Opcional

## Filtros Disponibles

### Búsqueda
- Por nombre del producto
- Por código del producto

### Filtros por Categoría
- Todas las categorías
- Panadería
- Repostería
- Bebidas
- Lácteos
- Frutas y Verduras
- Dulces y Chocolates

### Filtros por Estado
- Todos los estados
- Disponibles (stock > 10)
- Stock Bajo (stock 1-10)
- Sin Stock (stock = 0)

### Ordenamiento
- Por nombre
- Por precio
- Por stock

### Vista
- Lista (tabla)
- Grid (tarjetas)

## Cálculos Automáticos

### Estadísticas
- **Total Productos**: Cuenta total de productos
- **Disponibles**: Productos con stock > 10
- **Stock Bajo**: Productos con stock 1-10
- **Sin Stock**: Productos con stock = 0
- **Valor Total**: Suma de (precio × stock) de todos los productos
- **Precio Promedio**: Promedio de precios de todos los productos

### Formulario
- **Valor Total del Stock**: Se calcula automáticamente (precio × stock inicial)
- **Código del Producto**: Se genera automáticamente basado en categoría

## Próximas Mejoras
- [ ] Paginación de tabla
- [ ] Exportación a Excel
- [ ] Subida de imágenes
- [ ] Historial de cambios de precios
- [ ] Alertas de stock bajo
- [ ] Integración con sistema de compras
- [ ] Códigos de barras

## Notas Técnicas
- Usa Angular 20 standalone components
- Implementa lazy loading
- Manejo de errores robusto
- Validación de formularios reactivos
- Optimizado para rendimiento
- Cálculos automáticos en tiempo real
- Iconos de imagen placeholder para productos sin imagen