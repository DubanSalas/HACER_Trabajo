package pe.edu.vallegrande.project.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaleSummaryDTO {
    private BigDecimal totalSales;
    private BigDecimal todaySales;
    private Long completedSales;
    private Long pendingSales;
}