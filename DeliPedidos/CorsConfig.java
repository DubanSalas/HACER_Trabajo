// SOLUCIÓN DEFINITIVA PARA EL ERROR DE CORS
// Crea este archivo en tu backend Spring Boot:
// Ubicación: src/main/java/pe/edu/vallegrande/project/config/CorsConfig.java

package pe.edu.vallegrande.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // PERMITIR TODOS LOS ORÍGENES (para desarrollo)
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        
        // MÉTODOS HTTP PERMITIDOS
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // HEADERS PERMITIDOS
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // PERMITIR CREDENCIALES
        configuration.setAllowCredentials(true);
        
        // APLICAR A TODAS LAS RUTAS
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}

/*
ALTERNATIVA: Si ya tienes WebSecurityConfig, agrega esto al método configure:

@Override
protected void configure(HttpSecurity http) throws Exception {
    http.cors().configurationSource(corsConfigurationSource())
        .and()
        .csrf().disable()
        .authorizeRequests()
        .anyRequest().permitAll();
}
*/

// PASOS PARA IMPLEMENTAR:
// 1. Copia este código
// 2. Crea el archivo CorsConfig.java en tu backend
// 3. Reinicia tu backend Spring Boot
// 4. Prueba el login en http://localhost:50622/login