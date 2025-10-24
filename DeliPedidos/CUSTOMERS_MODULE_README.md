# Módulo de Gestión de Clientes

## Descripción
Este módulo implementa la gestión completa de clientes para el sistema DeliPedidos, siguiendo exactamente el diseño proporcionado y conectándose con el backend Oracle.

## Características Implementadas

### 🎨 Diseño
- ✅ Interfaz idéntica al diseño proporcionado
- ✅ Formulario modal con fondo granate (#7c1d3b)
- ✅ Cards de estadísticas con iconos coloridos
- ✅ Tabla responsive con acciones (editar, ver, eliminar)
- ✅ Filtros por ubicación (departamento, provincia, distrito) y estado
- ✅ Búsqueda en tiempo real

### 🔧 Funcionalidades
- ✅ CRUD completo de clientes
- ✅ Validación de formularios
- ✅ Alertas con SweetAlert2
- ✅ Filtros y búsqueda avanzada
- ✅ Estadísticas dinámicas (total, activos, inactivos, nuevos este mes)
- ✅ Generación de reportes PDF
- ✅ Manejo de ubicaciones

### 🌐 Conexión Backend
- ✅ Servicio configurado para conectar con backend en `localhost:8085`
- ✅ Endpoints siguiendo el patrón `/v1/api/customer`
- ✅ Manejo de errores robusto
- ✅ Soporte para reportes PDF

## Estructura de Archivos

```
src/app/
├── core/
│   ├── interfaces/
│   │   └── customer-interfaces.ts      # Interfaces basadas en BD Oracle
│   ├── services/
│   │   └── customer.service.ts         # Servicio principal
├── feature/customer/
│   ├── customer-list/
│   │   ├── customer-list.ts           # Componente principal
│   │   ├── customer-list.html         # Template
│   │   └── customer-list.scss         # Estilos
│   └── customer-form/
│       ├── customer-form.ts           # Formulario modal
│       ├── customer-form.html         # Template del formulario
│       └── customer-form.scss         # Estilos del formulario
```

## Endpoints del Backend

El servicio está configurado para conectarse a los siguientes endpoints:

### Clientes
- `GET /v1/api/customer/all` - Obtener todos los clientes
- `GET /v1/api/customer/status/{status}` - Filtrar por estado (A/I)
- `GET /v1/api/customer/{id}` - Obtener cliente por ID
- `POST /v1/api/customer/save` - Crear nuevo cliente
- `PUT /v1/api/customer/update/{id}` - Actualizar cliente
- `DELETE /v1/api/customer/delete/{id}` - Eliminar cliente
- `PUT /v1/api/customer/restore/{id}` - Restaurar cliente
- `GET /v1/api/customer/pdf` - Generar reporte PDF
- `GET /v1/api/customer/department/{department}` - Filtrar por departamento
- `GET /v1/api/customer/province/{province}` - Filtrar por provincia
- `GET /v1/api/customer/district/{district}` - Filtrar por distrito

### Ubicaciones
- `GET /v1/api/location/all` - Obtener todas las ubicaciones

## Estructura de Datos

### Customer (Basado en tabla Oracle)
```typescript
interface Customer {
  id_Customer?: number
  Client_Code: string
  Document_Type: string
  Document_Number: string
  Name: string
  Surname: string
  Date_Birth: Date
  Phone: string
  Email: string
  id_Location: number
  Register_Date?: Date
  Status: string  // 'A' = Activo, 'I' = Inactivo
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
El módulo está disponible en la ruta `/customers` y se carga de forma lazy.

### Uso con Backend
Para usar el módulo, asegúrate de que tu backend esté corriendo en `localhost:8085` con los endpoints mencionados.

## Características del Diseño

### Colores
- Fondo principal: `#f8f9fa`
- Formulario modal: `#7c1d3b` (granate)
- Botón principal: `#7c3aed` (morado)
- Estados:
  - Activo: `#10b981` (verde)
  - Inactivo: `#ef4444` (rojo)

### Cards de Estadísticas
- Total Clientes: Azul (`#3b82f6`)
- Activos: Verde (`#10b981`)
- Inactivos: Rojo (`#ef4444`)
- Nuevos Este Mes: Amarillo (`#f59e0b`)

### Responsive
- Diseño completamente responsive
- Grid adaptativo para cards
- Tabla responsive con scroll horizontal en móviles

## Validaciones del Formulario

- **Código Cliente**: Requerido
- **Tipo de Documento**: Requerido (DNI, CEX, PAS)
- **Número de Documento**: Requerido, 8 dígitos
- **Nombre**: Requerido
- **Apellido**: Requerido
- **Fecha de Nacimiento**: Requerida
- **Teléfono**: Requerido, 9 dígitos
- **Ubicación**: Requerida
- **Email**: Requerido, formato válido

## Filtros Disponibles

### Búsqueda
- Por nombre completo
- Por apellido
- Por código de cliente
- Por email

### Filtros por Ubicación
- Departamento
- Provincia
- Distrito

### Filtros por Estado
- Todos
- Activos
- Inactivos

## Próximas Mejoras
- [ ] Paginación de tabla
- [ ] Exportación a Excel
- [ ] Envío de reportes por email
- [ ] Filtros avanzados por fecha de registro
- [ ] Historial de compras del cliente
- [ ] Integración con sistema de puntos/fidelización

## Notas Técnicas
- Usa Angular 20 standalone components
- Implementa lazy loading
- Manejo de errores robusto
- Validación de formularios reactivos
- Optimizado para rendimiento
- Integración con Angular Material Datepicker
- Avatar personalizado con icono de persona en color rojo