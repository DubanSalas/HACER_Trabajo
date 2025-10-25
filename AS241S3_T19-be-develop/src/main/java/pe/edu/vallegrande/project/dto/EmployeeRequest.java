package pe.edu.vallegrande.project.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeRequest {
    
    @NotBlank(message = "El código del empleado es obligatorio")
    @Size(max = 20, message = "El código del empleado no puede exceder 20 caracteres")
    private String employeeCode;
    
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
    
    @NotNull(message = "La fecha de contratación es obligatoria")
    private LocalDate hireDate;
    
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String phone;
    
    @NotNull(message = "La ubicación es obligatoria")
    private Long locationId;
    
    @NotNull(message = "El salario es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El salario debe ser mayor que 0")
    private BigDecimal salary;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email no es válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;
    
    @NotNull(message = "El cargo es obligatorio")
    private Long positionId;
    
    @Pattern(regexp = "^[AI]$", message = "El estado debe ser A (Activo) o I (Inactivo)")
    private String status = "A";
}