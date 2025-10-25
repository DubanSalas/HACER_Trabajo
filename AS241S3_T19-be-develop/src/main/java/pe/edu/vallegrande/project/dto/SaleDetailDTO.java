package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SaleDetailDTO {
    private Long idSaleDetail;
    private Long saleId;
    private Long productId;
    private String productName;
    private String productCode;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}