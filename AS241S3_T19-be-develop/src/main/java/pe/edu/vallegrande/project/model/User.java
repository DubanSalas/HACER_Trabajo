package pe.edu.vallegrande.project.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "employee", schema = "DEVELOPER_01")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Employee", nullable = false)
    private Long idUser;

    @Column(name = "Employee_Code", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "Password", nullable = false, length = 255)
    private String password;

    @Column(name = "Position", nullable = false, length = 20)
    private String role; // ADMIN, EMPLEADO

    @Column(name = "Status", nullable = false, length = 1)
    private String state = "A"; // A=Activo, I=Inactivo
}