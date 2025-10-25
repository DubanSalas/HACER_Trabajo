package pe.edu.vallegrande.project.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "sale", schema = "DEVELOPER_01")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Sale", nullable = false)
    private Long idSale;

    @Column(name = "Sale_Code", nullable = false, unique = true, length = 20)
    private String saleCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Customer", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Employee", nullable = false)
    private Employee employee;

    @Column(name = "Sale_Date", nullable = false)
    private LocalDate saleDate;

    @Column(name = "Payment_Method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(name = "Status", nullable = false, length = 20)
    private String status = "Completado"; // Completado, Pendiente

    @Column(name = "Total", precision = 10, scale = 2)
    private BigDecimal total;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<SaleDetail> details = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (saleDate == null) {
            saleDate = LocalDate.now();
        }
    }

    public void calculateTotal() {
        BigDecimal calculatedTotal = BigDecimal.ZERO;
        for (SaleDetail detail : details) {
            if (detail.getSubtotal() != null) {
                calculatedTotal = calculatedTotal.add(detail.getSubtotal());
            }
        }
        this.total = calculatedTotal;
    }

    public void addDetail(SaleDetail detail) {
        details.add(detail);
        detail.setSale(this);
        calculateTotal();
    }

    public void removeDetail(SaleDetail detail) {
        details.remove(detail);
        detail.setSale(null);
        calculateTotal();
    }
}
