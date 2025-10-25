package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeDTO {
    private Long idEmployee;
    private String employeeCode;
    private String documentType;
    private String documentNumber;
    private String name;
    private String surname;
    private LocalDate hireDate;
    private String phone;
    private Long locationId;
    private String department;
    private String province;
    private String district;
    private String address;
    private BigDecimal salary;
    private String email;
    private Long positionId;
    private String positionName;
    private String status;
}