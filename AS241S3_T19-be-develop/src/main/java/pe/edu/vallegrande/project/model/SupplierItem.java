package pe.edu.vallegrande.project.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "supplier_item")
public class SupplierItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Supplier_Item", nullable = false)
    private Long idSupplierItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Supplier", nullable = false)
    private Supplier supplier;

    @Column(name = "Item_Name", nullable = false, length = 100)
    private String itemName;

    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @Column(name = "Unit_Price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "Subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "Total", nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "Status", nullable = false, length = 1)
    private String status = "A";

    @PrePersist
    protected void onCreate() {
        calculateTotals();
    }

    @PreUpdate
    protected void onUpdate() {
        calculateTotals();
    }

    private void calculateTotals() {
        if (quantity != null && unitPrice != null) {
            subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
            total = subtotal; // Por ahora sin impuestos adicionales
        }
    }
}