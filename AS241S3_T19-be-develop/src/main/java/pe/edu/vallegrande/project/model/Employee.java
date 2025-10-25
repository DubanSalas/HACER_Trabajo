package pe.edu.vallegrande.project.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "employee", schema = "DEVELOPER_01")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Employee", nullable = false)
    private Long idEmployee;

    @Column(name = "Employee_Code", nullable = false, unique = true, length = 20)
    private String employeeCode;

    @Column(name = "Document_Type", nullable = false, length = 3)
    private String documentType;

    @Column(name = "Document_Number", nullable = false, unique = true, length = 20)
    private String documentNumber;

    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Column(name = "Surname", nullable = false, length = 100)
    private String surname;

    @Column(name = "Hire_Date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "Phone", length = 20)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Location")
    private Location location;

    @Column(name = "Salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal salary;

    @Column(name = "Email", nullable = false, unique = true, length = 100)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Position")
    private Position position;

    @Column(name = "Status", nullable = false, length = 1)
    private String status = "A";
}
