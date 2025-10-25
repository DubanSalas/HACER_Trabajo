package pe.edu.vallegrande.project.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "product", schema = "DEVELOPER_01")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Product", nullable = false)
    private Long idProduct;

    @Column(name = "Product_Code", nullable = false, unique = true, length = 20)
    private String productCode;

    @Column(name = "Product_Name", nullable = false, length = 100)
    private String productName;

    @Column(name = "Category", nullable = false, length = 100)
    private String category;

    @Column(name = "Description", length = 500)
    private String description;

    @Column(name = "Price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "Stock", nullable = false)
    private Integer stock;

    @Column(name = "Initial_Stock", nullable = false)
    private Integer initialStock;

    @Column(name = "Image_Url", length = 500)
    private String imageUrl;

    @Column(name = "Status", nullable = false, length = 1)
    private String status = "A"; // A=Disponible, I=No disponible

    @PrePersist
    protected void onCreate() {
        if (initialStock == null) {
            initialStock = stock;
        }
    }

    // Método calculado para obtener el valor total del stock
    public BigDecimal getTotalStockValue() {
        if (price != null && stock != null) {
            return price.multiply(BigDecimal.valueOf(stock));
        }
        return BigDecimal.ZERO;
    }

    // Método para verificar si el stock está bajo (menos del 20% del stock inicial)
    public boolean isLowStock() {
        if (initialStock != null && stock != null) {
            return stock <= (initialStock * 0.2);
        }
        return false;
    }

    // Método para verificar si no hay stock
    public boolean isOutOfStock() {
        return stock == null || stock <= 0;
    }
}
