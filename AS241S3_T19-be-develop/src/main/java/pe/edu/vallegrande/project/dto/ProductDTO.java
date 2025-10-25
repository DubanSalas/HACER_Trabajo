package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDTO {
    private Long idProduct;
    private String productCode;
    private String productName;
    private String category;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Integer initialStock;
    private String imageUrl;
    private String status;
    private BigDecimal totalStockValue;
    private boolean lowStock;
    private boolean outOfStock;
}