package pe.edu.vallegrande.project.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "customer", schema = "DEVELOPER_01")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Customer")
    private Long idCustomer;

    @Column(name = "Client_Code", nullable = false, length = 10, unique = true)
    private String clientCode;

    @Column(name = "Document_Type", nullable = false, length = 3)
    private String documentType;

    @Column(name = "Document_Number", nullable = false, length = 20, unique = true)
    private String documentNumber;

    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Column(name = "Surname", nullable = false, length = 100)
    private String surname;

    @Column(name = "Date_Birth", nullable = false)
    private LocalDate dateBirth;

    @Column(name = "Phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "Email", nullable = false, length = 100, unique = true)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Location", nullable = false)
    private Location location;

    @Column(name = "Register_Date", nullable = false)
    private LocalDate registerDate;

    @Column(name = "Status", nullable = false, length = 1)
    private String status = "A";

    @PrePersist
    protected void onCreate() {
        if (registerDate == null) {
            registerDate = LocalDate.now();
        }
    }
}
