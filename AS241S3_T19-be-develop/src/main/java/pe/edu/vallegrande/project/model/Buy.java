package pe.edu.vallegrande.project.model;

import lombok.Data;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@Table(name = "buys", schema = "DEVELOPER_01")
public class Buy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Buys")
    private Long id;

    @Column(name = "Purchase_Date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "Total_Amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "Payment_Type", nullable = false, length = 50)
    private String paymentType;

    @Column(name = "id_Supplier", insertable = false, updatable = false)
    private Long idSupplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Supplier")
    @JsonIgnore // Evita problemas con LAZY y referencia cíclica en supplier
    private Supplier supplier;

    @OneToMany(mappedBy = "buy", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Marca la referencia "padre" para serializar sin ciclos
    private List<PurchaseDetail> purchaseDetails;
}
