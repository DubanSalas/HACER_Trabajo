# Módulo de Ventas - DeliPedidos

## Descripción
Módulo completo para la gestión de ventas con funcionalidades CRUD, diseño responsive y integración con clientes, empleados y productos.

## Estructura de Archivos

### Interfaces
- `src/app/core/interfaces/sales-interfaces.ts` - Definiciones de tipos para ventas

### Servicios
- `src/app/core/services/sales.service.ts` - Servicio principal para operaciones CRUD

### Componentes
- `src/app/feature/sales/sales-list/` - Componente de listado de ventas
- `src/app/feature/sales/sales-form/` - Componente de formulario modal

## Características Implementadas

### 1. Interfaces y Tipos
- `Sale` - Estructura básica de venta
- `SaleDetail` - Detalles de productos en la venta
- `SaleWithDetails` - Venta completa con detalles
- `CreateSaleRequest` - Datos para crear venta
- `UpdateSaleRequest` - Datos para actualizar venta
- `SaleStats` - Estadísticas de ventas
- `SaleFilters` - Filtros de búsqueda
- `SaleProduct` - Productos disponibles para venta

### 2. Servicio de Ventas
- **Endpoints REST**: Integración con API en `localhost:8085/api/sales`
- **BehaviorSubject**: Manejo reactivo de estado
- **Operaciones CRUD**: Crear, leer, actualizar, eliminar
- **Estadísticas**: Cálculo de métricas de ventas
- **Filtros**: Búsqueda y filtrado avanzado
- **Manejo de errores**: Gestión robusta de errores

### 3. Componente de Lista
- **Cards de estadísticas**: Ventas totales, ventas hoy, completadas, pendientes
- **Filtros avanzados**: Por estado, método de pago, fechas
- **Búsqueda**: Por ID, cliente o empleado
- **Tabla responsive**: Diseño adaptable
- **Acciones**: Editar, ver detalles, eliminar
- **Estados visuales**: Badges de estado con colores

### 4. Componente de Formulario
- **Modal con fondo granate**: Diseño consistente (#7c1d3b)
- **Formulario reactivo**: Validaciones completas
- **Gestión de productos**: Agregar/quitar productos dinámicamente
- **Cálculos automáticos**: Subtotales y total
- **Validaciones**: Campos requeridos y valores mínimos
- **Integración**: Con clientes, empleados y productos

### 5. Diseño y Estilos
- **Colores consistentes**: Siguiendo paleta establecida
- **Responsive design**: Adaptable a móviles y tablets
- **Animaciones**: Transiciones suaves
- **Iconografía**: Material Icons
- **Estados visuales**: Hover, focus, disabled

### 6. Funcionalidades Específicas
- **Gestión de detalles**: Múltiples productos por venta
- **Cálculo de precios**: Automático basado en cantidad y precio unitario
- **Validación de stock**: Información de disponibilidad
- **Estados de venta**: Pendiente, Completado, Cancelado
- **Métodos de pago**: Efectivo, Tarjeta, Transferencia

## Integración con Otros Módulos

### Dependencias
- **Clientes**: Para selección en formulario
- **Empleados**: Para asignación de vendedor
- **Productos**: Para selección y precios

### Servicios Utilizados
- `CustomersService` - Obtener lista de clientes
- `EmployeesService` - Obtener lista de empleados
- `ProductsService` - Obtener productos disponibles (fallback)

## Configuración de API

### Endpoints Esperados
```
GET    /api/sales              - Obtener todas las ventas
GET    /api/sales/{id}         - Obtener venta por ID
POST   /api/sales              - Crear nueva venta
PUT    /api/sales/{id}         - Actualizar venta
DELETE /api/sales/{id}         - Eliminar venta
GET    /api/sales/stats        - Obtener estadísticas
GET    /api/products/for-sale  - Obtener productos para venta
```

### Estructura de Datos
```typescript
// Crear venta
{
  "id_cliente": number,
  "id_empleado": number,
  "metodo_pago": string,
  "estado": string,
  "detalles": [
    {
      "id_producto": number,
      "cantidad": number,
      "precio_unitario": number
    }
  ]
}
```

## Uso del Módulo

### Importación
```typescript
import { SalesListComponent } from './feature/sales/sales-list/sales-list';
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
- **Ventas Totales**: Monto total y número de transacciones (verde)
- **Ventas Hoy**: Monto y cantidad del día actual (azul)
- **Completadas**: Número de ventas exitosas (verde)
- **Pendientes**: Ventas por procesar (amarillo)

### Tabla de Ventas
- ID con icono de carrito
- Información de cliente y empleado
- Fecha formateada
- Método de pago
- Total con formato de moneda
- Estado con badge colorizado
- Acciones: editar, ver, eliminar

### Formulario Modal
- Fondo granate característico
- Selección de cliente y empleado
- Método de pago y estado
- Tabla dinámica de productos
- Cálculos automáticos
- Validaciones en tiempo real

## Responsive Design
- **Desktop**: Diseño completo con todas las funcionalidades
- **Tablet**: Adaptación de grillas y espaciados
- **Mobile**: Tabla responsive y formulario adaptado

## Manejo de Estados
- **Loading**: Spinner durante operaciones
- **Empty**: Estado vacío con mensaje
- **Error**: Alertas con SweetAlert2
- **Success**: Confirmaciones de operaciones

Este módulo completa el sistema de gestión con funcionalidades avanzadas de ventas, manteniendo la consistencia de diseño y la integración con el resto del sistema.