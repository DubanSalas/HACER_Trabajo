package pe.edu.vallegrande.project.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "position", schema = "DEVELOPER_01")
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Position", nullable = false)
    private Long idPosition;

    @Column(name = "Position_Name", nullable = false, length = 100)
    private String positionName;

    @Column(name = "Description", length = 200)
    private String description;

    @Column(name = "Status", nullable = false, length = 1)
    private String status = "A";

    @OneToMany(mappedBy = "position", cascade = CascadeType.ALL)
    private List<Employee> employees;
}