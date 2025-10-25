package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SupplierItemDTO {
    private Long idSupplierItem;
    private Long supplierId;
    private String itemName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private BigDecimal total;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}