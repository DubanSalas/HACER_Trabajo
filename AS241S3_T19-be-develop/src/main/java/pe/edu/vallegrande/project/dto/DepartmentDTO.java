package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DepartmentDTO {
    private Long idDepartment;
    private String departmentName;
    private String description;
    private String status;
    private Long employeeCount;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}