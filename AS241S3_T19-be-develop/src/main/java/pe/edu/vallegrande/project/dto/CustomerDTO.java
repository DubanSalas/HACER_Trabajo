package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CustomerDTO {
    private Long idCustomer;
    private String clientCode;
    private String documentType;
    private String documentNumber;
    private String name;
    private String surname;
    private LocalDate dateBirth;
    private String phone;
    private String email;
    private Long locationId;
    private String department;
    private String province;
    private String district;
    private String locationAddress;
    private LocalDate registerDate;
    private String status;
}