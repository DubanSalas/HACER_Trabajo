# 🔧 Guía de Solución de Problemas de Conectividad

## ✅ Configuración Actual

### Frontend (Angular)
- **Puerto:** 4202
- **URLs de servicios:** Usando `${environment.urlBackEnd}/v1/api/...`
- **Environment:** `http://localhost:8085`
- **Interceptor:** Activo con logs de debug

### Backend (Spring Boot)
- **Puerto esperado:** 8085
- **Base URL:** `http://localhost:8085`
- **Endpoints:** `/v1/api/customer`, `/v1/api/auth`, etc.

## 🧪 Métodos de Prueba

### 1. Componente de Prueba Angular
Visita: `http://localhost:4202/test`

Este componente probará:
- ✅ Conexión HTTP directa
- ✅ Servicio de Customer
- ✅ Endpoint de autenticación

### 2. Script de Debug en Consola
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña Console
3. Copia y pega el contenido de `debug-connection.js`
4. Presiona Enter para ejecutar

### 3. Prueba Manual con cURL
```bash
# Probar backend directamente
curl -X GET http://localhost:8085/v1/api/customer -H "Content-Type: application/json"

# Probar a través del proxy (desde otra terminal)
curl -X GET http://localhost:4202/v1/api/customer -H "Content-Type: application/json"
```

## 🔍 Verificaciones Paso a Paso

### 1. Verificar que el Backend esté corriendo
```bash
# Verificar si el puerto 8085 está en uso
netstat -an | findstr :8085
```

### 2. Verificar que Angular esté corriendo con proxy
El comando debe ser:
```bash
ng serve --port 4202 --proxy-config proxy.conf.json
```

### 3. Verificar logs en la consola del navegador
- Abre F12 → Console
- Busca mensajes del interceptor: `🔄 Interceptor processing request`
- Busca errores de CORS o network

## ❌ Problemas Comunes y Soluciones

### Error: "CORS policy"
**Causa:** El backend no tiene configuración CORS correcta
**Solución:** Agregar configuración CORS en Spring Boot:
```java
@CrossOrigin(origins = "http://localhost:4202")
```

### Error: "ERR_CONNECTION_REFUSED"
**Causa:** El backend no está corriendo o está en otro puerto
**Solución:** 
1. Verificar que el backend esté corriendo
2. Verificar el puerto en `application.properties`

### Error: "404 Not Found"
**Causa:** Los endpoints no existen o tienen nombres diferentes
**Solución:** Verificar los controladores en el backend

### Error: "Proxy config not working"
**Causa:** Angular no está usando el proxy
**Solución:** 
1. Verificar que se esté usando `--proxy-config proxy.conf.json`
2. Reiniciar el servidor de desarrollo

## 🔧 Configuración de CORS en Spring Boot

Agregar en el backend:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## 📝 Logs Útiles

### En la consola del navegador:
- `🔄 Interceptor processing request` - El interceptor está funcionando
- `✅ Request headers set` - Headers configurados correctamente
- `❌ HTTP Error` - Error en la petición

### En la consola de Angular:
- `[webpack-dev-server] proxy created` - Proxy configurado
- `[HPM] Proxy created` - Proxy funcionando

## 🎯 Próximos Pasos

1. **Ejecutar el test:** Ve a `http://localhost:4202/test`
2. **Revisar logs:** Abre F12 y revisa la consola
3. **Verificar backend:** Asegúrate de que esté corriendo en puerto 8085
4. **Probar endpoints:** Usa el script de debug o el componente de prueba

## 📞 Si Necesitas Ayuda

Comparte los siguientes datos:
1. Resultado del componente de prueba
2. Logs de la consola del navegador
3. Estado del backend (¿está corriendo?)
4. Configuración de CORS en el backend