# Módulo de Gestión de Empleados

## Descripción
Este módulo implementa la gestión completa de empleados para el sistema DeliPedidos, siguiendo exactamente el diseño proporcionado y conectándose con el backend Oracle.

## Características Implementadas

### 🎨 Diseño
- ✅ Interfaz idéntica al diseño proporcionado
- ✅ Formulario modal con fondo granate (#7c1d3b)
- ✅ Cards de estadísticas con iconos coloridos
- ✅ Tabla responsive con acciones (editar, ver, eliminar)
- ✅ Filtros por estado
- ✅ Búsqueda en tiempo real
- ✅ Distribución por cargos

### 🔧 Funcionalidades
- ✅ CRUD completo de empleados
- ✅ Validación de formularios
- ✅ Alertas con SweetAlert2
- ✅ Filtros y búsqueda
- ✅ Estadísticas dinámicas (total, activos, inactivos, salario promedio)
- ✅ Distribución por cargos
- ✅ Generación de reportes PDF
- ✅ Manejo de ubicaciones y posiciones

### 🌐 Conexión Backend
- ✅ Servicio configurado para conectar con backend en `localhost:8085`
- ✅ Endpoints siguiendo el patrón `/v1/api/employee`
- ✅ Manejo de errores robusto
- ✅ Soporte para reportes PDF

## Estructura de Archivos

```
src/app/
├── core/
│   ├── interfaces/
│   │   └── employees-interfaces.ts     # Interfaces basadas en BD Oracle
│   ├── services/
│   │   └── employees.service.ts        # Servicio principal
│   └── resolvers/
│       └── employees.resolver.ts       # Resolver para cargar datos
├── feature/employees/
│   ├── employees-list/
│   │   ├── employees-list.ts          # Componente principal
│   │   ├── employees-list.html        # Template
│   │   └── employees-list.scss        # Estilos
│   └── employees-form/
│       ├── employees-form.ts          # Formulario modal
│       ├── employees-form.html        # Template del formulario
│       └── employees-form.scss        # Estilos del formulario
```

## Endpoints del Backend

El servicio está configurado para conectarse a los siguientes endpoints:

### Empleados
- `GET /v1/api/employee/all` - Obtener todos los empleados
- `GET /v1/api/employee/status/{status}` - Filtrar por estado (A/I)
- `GET /v1/api/employee/{id}` - Obtener empleado por ID
- `POST /v1/api/employee/save` - Crear nuevo empleado
- `PUT /v1/api/employee/update/{id}` - Actualizar empleado
- `DELETE /v1/api/employee/delete/{id}` - Eliminar empleado
- `PUT /v1/api/employee/restore/{id}` - Restaurar empleado
- `GET /v1/api/employee/pdf` - Generar reporte PDF
- `GET /v1/api/employee/position/{id}` - Filtrar por cargo

### Posiciones/Cargos
- `GET /v1/api/position/all` - Obtener todas las posiciones

### Ubicaciones
- `GET /v1/api/location/all` - Obtener todas las ubicaciones

## Estructura de Datos

### Employee (Basado en tabla Oracle)
```typescript
interface Employee {
  id_Employee?: number
  Employee_Code: string
  Document_Type: string
  Document_Number: string
  Name: string
  Surname: string
  Hire_Date: Date
  Phone: string
  id_Location: number
  Salary: number
  Email: string
  id_Position: number
  Status: string  // 'A' = Activo, 'I' = Inactivo
}
```

### Position (Basado en tabla Oracle)
```typescript
interface Position {
  id_Position: number
  Position_Name: string
  Description: string
  Status: string
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
El módulo está disponible en la ruta `/employees` y se carga de forma lazy.

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
- Total Empleados: Azul (`#3b82f6`)
- Activos: Verde (`#10b981`)
- Inactivos: Rojo (`#ef4444`)
- Salario Promedio: Amarillo (`#f59e0b`)

### Responsive
- Diseño completamente responsive
- Grid adaptativo para cards
- Tabla responsive con scroll horizontal en móviles

## Validaciones del Formulario

- **Código Empleado**: Requerido
- **Tipo de Documento**: Requerido (DNI, CEX, PAS)
- **Número de Documento**: Requerido, 8 dígitos
- **Nombre**: Requerido
- **Apellido**: Requerido
- **Fecha de Contratación**: Requerida
- **Teléfono**: Requerido, 9 dígitos
- **Ubicación**: Requerida
- **Salario**: Requerido, mayor a 0
- **Email**: Requerido, formato válido
- **Cargo**: Requerido

## Próximas Mejoras
- [ ] Paginación de tabla
- [ ] Exportación a Excel
- [ ] Envío de reportes por email
- [ ] Filtros avanzados por cargo y ubicación
- [ ] Historial de cambios de empleados
- [ ] Cálculo automático de antigüedad

## Notas Técnicas
- Usa Angular 20 standalone components
- Implementa lazy loading
- Manejo de errores robusto
- Validación de formularios reactivos
- Optimizado para rendimiento
- Integración con Angular Material Datepicker