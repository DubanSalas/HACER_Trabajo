package pe.edu.vallegrande.project.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierSummaryDTO {
    private Long totalSuppliers;
    private Long activeSuppliers;
    private Long inactiveSuppliers;
    private Long suspendedSuppliers;
}