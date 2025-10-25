package pe.edu.vallegrande.project.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class SupplierRequest {
    
    @NotBlank(message = "El nombre de la empresa es obligatorio")
    @Size(max = 100, message = "El nombre de la empresa no puede exceder 100 caracteres")
    private String companyName;
    
    @NotBlank(message = "El nombre del contacto es obligatorio")
    @Size(max = 100, message = "El nombre del contacto no puede exceder 100 caracteres")
    private String contactName;
    
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String phone;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email no es válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;
    
    @Size(max = 200, message = "La dirección no puede exceder 200 caracteres")
    private String address;
    
    @NotBlank(message = "La categoría es obligatoria")
    @Size(max = 100, message = "La categoría no puede exceder 100 caracteres")
    private String category;
    
    @NotBlank(message = "Los términos de pago son obligatorios")
    @Size(max = 100, message = "Los términos de pago no pueden exceder 100 caracteres")
    private String paymentTerms;
    
    @NotNull(message = "La ubicación es obligatoria")
    private Long locationId;
    
    @Pattern(regexp = "^[AIS]$", message = "El estado debe ser A (Activo), I (Inactivo) o S (Suspendido)")
    private String status = "A";
}