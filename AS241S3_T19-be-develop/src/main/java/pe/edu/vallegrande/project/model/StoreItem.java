package pe.edu.vallegrande.project.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "store_item", schema = "DEVELOPER_01")
public class StoreItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Store_Item", nullable = false)
    private Long idStoreItem;

    @Column(name = "Item_Code", nullable = false, unique = true, length = 20)
    private String itemCode;

    @Column(name = "Product_Name", nullable = false, length = 100)
    private String productName;

    @Column(name = "Category", nullable = false, length = 100)
    private String category;

    @Column(name = "Current_Stock", nullable = false)
    private Integer currentStock;

    @Column(name = "Minimum_Stock", nullable = false)
    private Integer minimumStock;

    @Column(name = "Unit", nullable = false, length = 20)
    private String unit; // kg, unidades, litros, etc.

    @Column(name = "Unit_Price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Supplier")
    private Supplier supplier;

    @Column(name = "Expiry_Date")
    private LocalDate expiryDate;

    @Column(name = "Location", length = 200)
    private String location;

    @Column(name = "Status", nullable = false, length = 20)
    private String status = "Disponible"; // Disponible, Agotado, Próximo a Vencer, Stock Bajo

    @PrePersist
    protected void onCreate() {
        updateStatus();
    }

    @PreUpdate
    protected void onUpdate() {
        updateStatus();
    }

    // Método para actualizar el estado automáticamente
    public void updateStatus() {
        if (currentStock == null || currentStock <= 0) {
            status = "Agotado";
        } else if (minimumStock != null && currentStock <= minimumStock) {
            status = "Stock Bajo";
        } else if (expiryDate != null && expiryDate.isBefore(LocalDate.now().plusDays(7))) {
            status = "Próximo a Vencer";
        } else {
            status = "Disponible";
        }
    }

    // Método para verificar si está próximo a vencer (7 días)
    public boolean isNearExpiry() {
        return expiryDate != null && expiryDate.isBefore(LocalDate.now().plusDays(7));
    }

    // Método para verificar si está agotado
    public boolean isOutOfStock() {
        return currentStock == null || currentStock <= 0;
    }

    // Método para verificar si tiene stock bajo
    public boolean isLowStock() {
        return minimumStock != null && currentStock != null && currentStock <= minimumStock;
    }

    // Método para calcular el valor total del stock
    public BigDecimal getTotalStockValue() {
        if (currentStock != null && unitPrice != null) {
            return unitPrice.multiply(BigDecimal.valueOf(currentStock));
        }
        return BigDecimal.ZERO;
    }
}