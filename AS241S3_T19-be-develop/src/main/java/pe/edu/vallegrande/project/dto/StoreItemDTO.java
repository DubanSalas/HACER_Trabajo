package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StoreItemDTO {
    private Long idStoreItem;
    private String itemCode;
    private String productName;
    private String category;
    private Integer currentStock;
    private Integer minimumStock;
    private String unit;
    private BigDecimal unitPrice;
    private Long supplierId;
    private String supplierName;
    private LocalDate expiryDate;
    private String location;
    private String status;
    private BigDecimal totalStockValue;
    private boolean nearExpiry;
    private boolean outOfStock;
    private boolean lowStock;
}