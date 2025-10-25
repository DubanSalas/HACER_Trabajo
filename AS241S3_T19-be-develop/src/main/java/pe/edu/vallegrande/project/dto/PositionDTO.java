package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PositionDTO {
    private Long idPosition;
    private String positionName;
    private String description;
    private String status;
    private Long employeeCount;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}