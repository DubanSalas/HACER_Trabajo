package pe.edu.vallegrande.project.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeSummaryDTO {
    private Long totalEmployees;
    private Long activeEmployees;
    private Long inactiveEmployees;
    private BigDecimal averageSalary;
}