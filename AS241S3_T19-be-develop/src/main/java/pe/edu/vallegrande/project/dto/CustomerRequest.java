package pe.edu.vallegrande.project.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Data
public class CustomerRequest {
    
    @NotBlank(message = "El código del cliente es obligatorio")
    @Size(max = 10, message = "El código del cliente no puede exceder 10 caracteres")
    private String clientCode;
    
    @NotBlank(message = "El tipo de documento es obligatorio")
    @Size(max = 3, message = "El tipo de documento no puede exceder 3 caracteres")
    private String documentType;
    
    @NotBlank(message = "El número de documento es obligatorio")
    @Size(max = 20, message = "El número de documento no puede exceder 20 caracteres")
    private String documentNumber;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String name;
    
    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no puede exceder 100 caracteres")
    private String surname;
    
    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate dateBirth;
    
    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String phone;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email no es válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;
    
    @NotNull(message = "La ubicación es obligatoria")
    private Long locationId;
    
    @Pattern(regexp = "^[AI]$", message = "El estado debe ser A (Activo) o I (Inactivo)")
    private String status = "A";
}