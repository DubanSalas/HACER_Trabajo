package pe.edu.vallegrande.project.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PositionSummaryDTO {
    private String positionName;
    private Long employeeCount;
}