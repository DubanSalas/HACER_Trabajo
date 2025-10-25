package pe.edu.vallegrande.project.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductSummaryDTO {
    private Long totalProducts;
    private Long availableProducts;
    private Long lowStockProducts;
    private Long outOfStockProducts;
    private BigDecimal totalInventoryValue;
    private BigDecimal averagePrice;
}