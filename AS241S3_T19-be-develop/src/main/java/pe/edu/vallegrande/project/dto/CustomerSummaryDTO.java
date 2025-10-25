package pe.edu.vallegrande.project.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerSummaryDTO {
    private Long totalCustomers;
    private Long activeCustomers;
    private Long inactiveCustomers;
    private Long newThisMonth;
}