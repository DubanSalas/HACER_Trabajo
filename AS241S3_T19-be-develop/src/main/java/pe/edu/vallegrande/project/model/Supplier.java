package pe.edu.vallegrande.project.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "supplier", schema = "DEVELOPER_01")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Supplier", nullable = false)
    private Long idSupplier;

    @Column(name = "Company_Name", nullable = false, length = 100)
    private String companyName;

    @Column(name = "Contact_Name", nullable = false, length = 100)
    private String contactName;

    @Column(name = "Phone", length = 20)
    private String phone;

    @Column(name = "Email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "Address", length = 200)
    private String address;

    @Column(name = "Category", length = 100)
    private String category;

    @Column(name = "Payment_Terms", length = 100)
    private String paymentTerms;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Location")
    private Location location;

    @Column(name = "Status", nullable = false, length = 1)
    private String status = "A"; // A=Activo, I=Inactivo, S=Suspendido
}
