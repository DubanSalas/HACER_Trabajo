package pe.edu.vallegrande.project.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreSummaryDTO {
    private Long totalProducts;
    private Long lowStockItems;
    private Long outOfStockItems;
    private Long nearExpiryItems;
    private BigDecimal totalInventoryValue;
}