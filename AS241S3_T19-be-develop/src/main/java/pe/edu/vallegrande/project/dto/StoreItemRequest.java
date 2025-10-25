package pe.edu.vallegrande.project.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StoreItemRequest {
    
    @NotBlank(message = "El código del item es obligatorio")
    @Size(max = 20, message = "El código del item no puede exceder 20 caracteres")
    private String itemCode;
    
    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(max = 100, message = "El nombre del producto no puede exceder 100 caracteres")
    private String productName;
    
    @NotBlank(message = "La categoría es obligatoria")
    @Size(max = 100, message = "La categoría no puede exceder 100 caracteres")
    private String category;
    
    @NotNull(message = "El stock actual es obligatorio")
    @Min(value = 0, message = "El stock actual no puede ser negativo")
    private Integer currentStock;
    
    @NotNull(message = "El stock mínimo es obligatorio")
    @Min(value = 0, message = "El stock mínimo no puede ser negativo")
    private Integer minimumStock;
    
    @NotBlank(message = "La unidad es obligatoria")
    @Size(max = 20, message = "La unidad no puede exceder 20 caracteres")
    private String unit;
    
    @NotNull(message = "El precio unitario es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio unitario debe ser mayor que 0")
    private BigDecimal unitPrice;
    
    private Long supplierId;
    
    private LocalDate expiryDate;
    
    @Size(max = 200, message = "La ubicación no puede exceder 200 caracteres")
    private String location;
    
    @Pattern(regexp = "^(Disponible|Agotado|Próximo a Vencer|Stock Bajo)$", 
             message = "El estado debe ser 'Disponible', 'Agotado', 'Próximo a Vencer' o 'Stock Bajo'")
    private String status = "Disponible";
}