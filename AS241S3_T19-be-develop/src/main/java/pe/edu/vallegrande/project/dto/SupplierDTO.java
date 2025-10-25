package pe.edu.vallegrande.project.dto;

import lombok.Data;

@Data
public class SupplierDTO {
    private Long idSupplier;
    private String companyName;
    private String contactName;
    private String phone;
    private String email;
    private String address;
    private String category;
    private String paymentTerms;
    private Long locationId;
    private String department;
    private String province;
    private String district;
    private String locationAddress;
    private String status;
}