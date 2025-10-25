package pe.edu.vallegrande.project.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

@Data
public class SaleRequest {
    
    @Size(max = 20, message = "El código de venta no puede exceder 20 caracteres")
    private String saleCode;
    
    @NotNull(message = "El cliente es obligatorio")
    private Long customerId;
    
    @NotNull(message = "El empleado es obligatorio")
    private Long employeeId;
    
    private LocalDate saleDate;
    
    @NotBlank(message = "El método de pago es obligatorio")
    @Size(max = 50, message = "El método de pago no puede exceder 50 caracteres")
    private String paymentMethod;
    
    @Pattern(regexp = "^(Completado|Pendiente)$", message = "El estado debe ser 'Completado' o 'Pendiente'")
    private String status = "Completado";
    
    @NotEmpty(message = "Debe incluir al menos un detalle de venta")
    private List<SaleDetailRequest> details;
}