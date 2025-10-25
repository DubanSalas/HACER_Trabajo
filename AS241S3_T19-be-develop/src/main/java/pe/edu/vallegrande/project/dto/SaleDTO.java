package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class SaleDTO {
    private Long idSale;
    private String saleCode;
    private Long customerId;
    private String customerName;
    private String customerSurname;
    private String customerFullName;
    private Long employeeId;
    private String employeeName;
    private String employeeSurname;
    private String employeeFullName;
    private LocalDate saleDate;
    private String paymentMethod;
    private String status;
    private BigDecimal total;
    private List<SaleDetailDTO> details;
}