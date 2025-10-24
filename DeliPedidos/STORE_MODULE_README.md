# Módulo de Almacén (Store) - DeliPedidos

## Descripción
Módulo completo para la gestión de almacén e inventario con funcionalidades CRUD, control de stock, fechas de vencimiento y diseño responsive.

## Estructura de Archivos

### Interfaces
- `src/app/core/interfaces/store-interfaces.ts` - Definiciones de tipos para almacén

### Servicios
- `src/app/core/services/store.service.ts` - Servicio principal para operaciones CRUD

### Componentes
- `src/app/feature/store/store-list/` - Componente de listado de productos en almacén
- `src/app/feature/store/store-form/` - Componente de formulario modal

## Características Implementadas

### 1. Interfaces y Tipos
- `StoreItem` - Estructura de producto en almacén
- `CreateStoreItemRequest` - Datos para agregar producto al almacén
- `UpdateStoreItemRequest` - Datos para actualizar producto
- `StoreStats` - Estadísticas del almacén
- `StoreFilters` - Filtros de búsqueda
- `StockMovement` - Movimientos de stock
- `StoreProduct` - Productos disponibles para almacén
- `StoreSupplier` - Proveedores para almacén

### 2. Servicio de Almacén
- **Endpoints REST**: Integración con API en `localhost:8085/api/store`
- **BehaviorSubject**: Manejo reactivo de estado
- **Operaciones CRUD**: Crear, leer, actualizar, eliminar
- **Estadísticas**: Cálculo de métricas de inventario
- **Filtros**: Búsqueda y filtrado avanzado
- **Movimientos de stock**: Registro de entradas y salidas
- **Manejo de errores**: Gestión robusta de errores

### 3. Componente de Lista
- **Cards de estadísticas**: Total productos, stock bajo, agotados, próximos a vencer
- **Filtros avanzados**: Por categoría, estado, proveedor
- **Búsqueda**: Por nombre de producto o proveedor
- **Tabla responsive**: Diseño adaptable con información completa
- **Acciones**: Editar, ver detalles, eliminar
- **Estados visuales**: Badges de estado y alertas de vencimiento

### 4. Componente de Formulario
- **Modal con fondo granate**: Diseño consistente (#7c1d3b)
- **Formulario reactivo**: Validaciones completas
- **Selección de productos**: Integración con módulo de productos
- **Selección de proveedores**: Integración con módulo de proveedores
- **Cálculos automáticos**: Valor total del inventario
- **Validaciones**: Campos requeridos y valores mínimos

### 5. Diseño y Estilos
- **Colores consistentes**: Siguiendo paleta establecida
- **Responsive design**: Adaptable a móviles y tablets
- **Animaciones**: Transiciones suaves
- **Iconografía**: Material Icons específicos para almacén
- **Estados visuales**: Hover, focus, disabled, alertas

### 6. Funcionalidades Específicas del Almacén
- **Control de stock**: Stock actual vs stock mínimo
- **Fechas de vencimiento**: Alertas para productos próximos a vencer
- **Estados de productos**: Disponible, Agotado, Próximo a Vencer, Vencido, En Revisión
- **Unidades de medida**: kg, g, L, ml, unidad, caja, paquete, bolsa
- **Ubicaciones**: Control de ubicación física en almacén
- **Valor de inventario**: Cálculo automático del valor total

## Integración con Otros Módulos

### Dependencias
- **Productos**: Para selección en formulario
- **Proveedores**: Para asignación de proveedor

### Servicios Utilizados
- `ProductsService` - Obtener lista de productos
- `SuppliersService` - Obtener lista de proveedores

## Configuración de API

### Endpoints Esperados
```
GET    /api/store              - Obtener todos los items del almacén
GET    /api/store/{id}         - Obtener item por ID
POST   /api/store              - Crear nuevo item en almacén
PUT    /api/store/{id}         - Actualizar item del almacén
DELETE /api/store/{id}         - Eliminar item del almacén
GET    /api/store/stats        - Obtener estadísticas del almacén
GET    /api/store/movements    - Obtener movimientos de stock
POST   /api/store/movements    - Crear movimiento de stock
GET    /api/products/for-store - Obtener productos para almacén
GET    /api/suppliers/for-store - Obtener proveedores para almacén
```

### Estructura de Datos
```typescript
// Crear item en almacén
{
  "id_Product": number,
  "current_stock": number,
  "min_stock": number,
  "unit": string,
  "unit_price": number,
  "id_Supplier": number,
  "expiry_date": string,
  "location": string,
  "status": string
}
```

## Uso del Módulo

### Importación
```typescript
import { StoreListComponent } from './feature/store/store-list/store-list';
```

### Navegación
El componente se puede integrar en el sistema de rutas de Angular.

### Dependencias Requeridas
- Angular Material
- SweetAlert2
- RxJS
- Angular Forms (Reactive)

## Características del Diseño

### Cards de Estadísticas
- **Total Productos**: Número total de productos en inventario (azul)
- **Stock Bajo**: Productos que requieren reposición (amarillo)
- **Agotados**: Productos sin stock (rojo)
- **Próximos a Vencer**: Productos que vencen en 7 días (naranja)

### Tabla de Almacén
- Información de producto con imagen e ID
- Categoría del producto
- Stock actual vs mínimo con códigos de color
- Precio unitario
- Proveedor asignado
- Fecha de vencimiento con alertas
- Estado con badge colorizado
- Acciones: editar, ver, eliminar

### Formulario Modal
- Fondo granate característico
- Selección de producto con actualización automática de precio
- Campos de stock actual y mínimo
- Selección de unidad de medida
- Precio unitario editable
- Selección de proveedor
- Fecha de vencimiento con validación
- Ubicación física en almacén
- Estado del producto
- Cálculo automático de valor total

## Alertas y Notificaciones
- **Stock Bajo**: Cuando stock actual ≤ stock mínimo
- **Sin Stock**: Cuando stock actual = 0
- **Próximo a Vencer**: Productos que vencen en 7 días
- **Vencido**: Productos con fecha de vencimiento pasada

## Responsive Design
- **Desktop**: Diseño completo con todas las funcionalidades
- **Tablet**: Adaptación de grillas y espaciados
- **Mobile**: Tabla responsive y formulario adaptado

## Manejo de Estados
- **Loading**: Spinner durante operaciones
- **Empty**: Estado vacío con mensaje
- **Error**: Alertas con SweetAlert2
- **Success**: Confirmaciones de operaciones
- **Stock States**: Colores diferenciados para niveles de stock
- **Expiry States**: Alertas visuales para fechas de vencimiento

## Funcionalidades Avanzadas
- **Movimientos de Stock**: Registro de entradas, salidas y ajustes
- **Filtros Inteligentes**: Por categoría, estado, proveedor
- **Búsqueda Avanzada**: Por nombre de producto o proveedor
- **Cálculos Automáticos**: Valor total de inventario
- **Validaciones**: Control de stock mínimo y fechas

Este módulo completa el sistema de gestión con funcionalidades específicas de almacén, proporcionando control total sobre el inventario, fechas de vencimiento y movimientos de stock, manteniendo la consistencia de diseño con el resto del sistema.