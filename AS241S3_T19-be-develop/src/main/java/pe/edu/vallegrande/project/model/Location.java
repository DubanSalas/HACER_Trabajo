package pe.edu.vallegrande.project.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@Table(
    name = "LOCATION",
    schema = "DEVELOPER_01",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"department", "province", "district"})
    }
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "identifier_Location")
    private Long idLocation;

    @Column(name = "department", nullable = false, length = 100)
    private String department;

    @Column(name = "province", nullable = false, length = 100)
    private String province;

    @Column(name = "district", nullable = false, length = 100)
    private String district;

    @Column(name = "address", nullable = false, length = 100)
    private String address;
}
