# Módulo de Gestión de Proveedores

## Descripción
Este módulo implementa la gestión completa de proveedores para el sistema DeliPedidos, siguiendo exactamente el diseño proporcionado y conectándose con el backend Oracle.

## Características Implementadas

### 🎨 Diseño
- ✅ Interfaz idéntica al diseño proporcionado
- ✅ Formulario modal con fondo granate (#7c1d3b)
- ✅ Cards de estadísticas con iconos coloridos
- ✅ Tabla responsive con acciones (editar, ver, eliminar)
- ✅ Filtros por categoría y estado
- ✅ Búsqueda en tiempo real

### 🔧 Funcionalidades
- ✅ CRUD completo de proveedores
- ✅ Validación de formularios
- ✅ Alertas con SweetAlert2
- ✅ Filtros y búsqueda
- ✅ Estadísticas dinámicas
- ✅ Categorización de proveedores
- ✅ Generación de reportes PDF
- ✅ Manejo de ubicaciones

### 🌐 Conexión Backend
- ✅ Servicio configurado para conectar con backend en `localhost:8085`
- ✅ Endpoints siguiendo el patrón `/v1/api/supplier`
- ✅ Manejo de errores robusto
- ✅ Soporte para reportes PDF

## Estructura de Archivos

```
src/app/
├── core/
│   ├── interfaces/
│   │   └── suppliers-interfaces.ts     # Interfaces basadas en BD Oracle
│   ├── services/
│   │   └── suppliers.service.ts        # Servicio principal
│   └── resolvers/
│       └── suppliers.resolver.ts       # Resolver para cargar datos
├── feature/suppliers/
│   ├── suppliers-list/
│   │   ├── suppliers-list.ts          # Componente principal
│   │   ├── suppliers-list.html        # Template
│   │   └── suppliers-list.scss        # Estilos
│   └── suppliers-form/
│       ├── suppliers-form.ts          # Formulario modal
│       ├── suppliers-form.html        # Template del formulario
│       └── suppliers-form.scss        # Estilos del formulario
```

## Endpoints del Backend

El servicio está configurado para conectarse a los siguientes endpoints:

### Proveedores
- `GET /v1/api/supplier/all` - Obtener todos los proveedores
- `GET /v1/api/supplier/status/{status}` - Filtrar por estado (A/I/S)
- `GET /v1/api/supplier/{id}` - Obtener proveedor por ID
- `POST /v1/api/supplier/save` - Crear nuevo proveedor
- `PUT /v1/api/supplier/update/{id}` - Actualizar proveedor
- `DELETE /v1/api/supplier/delete/{id}` - Eliminar proveedor
- `PUT /v1/api/supplier/restore/{id}` - Restaurar proveedor
- `GET /v1/api/supplier/pdf` - Generar reporte PDF
- `GET /v1/api/supplier/categories` - Obtener categorías

### Ubicaciones
- `GET /v1/api/location/all` - Obtener todas las ubicaciones

## Estructura de Datos

### Supplier (Basado en tabla Oracle)
```typescript
interface Supplier {
  id_Supplier?: number
  Company_Name: string
  Contact_Name: string
  Phone: string
  Email: string
  Address: string
  Category: string
  Payment_Terms: string
  id_Location: number
  Status: string  // 'A' = Activo, 'I' = Inactivo, 'S' = Suspendido
}
```

### Location (Basado en tabla Oracle)
```typescript
interface Location {
  identifier_Location: number
  department: string
  province: string
  district: string
  address: string
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
El módulo está disponible en la ruta `/suppliers` y se carga de forma lazy.

### Uso con Backend
Para usar el módulo, asegúrate de que tu backend esté corriendo en `localhost:8085` con los endpoints mencionados. El sistema se conectará directamente al backend para todas las operaciones.

## Características del Diseño

### Colores
- Fondo principal: `#f8f9fa`
- Formulario modal: `#7c1d3b` (granate)
- Botón principal: `#7c3aed` (morado)
- Estados:
  - Activo: `#10b981` (verde)
  - Inactivo: `#ef4444` (rojo)
  - Suspendido: `#f59e0b` (naranja)

### Responsive
- Diseño completamente responsive
- Grid adaptativo para cards
- Tabla responsive con scroll horizontal en móviles

## Próximas Mejoras
- [ ] Paginación de tabla
- [ ] Exportación a Excel
- [ ] Envío de reportes por email
- [ ] Filtros avanzados
- [ ] Historial de cambios

## Notas Técnicas
- Usa Angular 20 standalone components
- Implementa lazy loading
- Manejo de errores robusto
- Validación de formularios reactivos
- Optimizado para rendimiento