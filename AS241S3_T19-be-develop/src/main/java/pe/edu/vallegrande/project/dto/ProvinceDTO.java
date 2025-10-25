package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProvinceDTO {
    private Long idProvince;
    private String provinceName;
    private String status;
    private Long employeeCount;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}