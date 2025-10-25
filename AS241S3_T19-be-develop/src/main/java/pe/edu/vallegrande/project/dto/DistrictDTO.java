package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DistrictDTO {
    private Long idDistrict;
    private String districtName;
    private Long provinceId;
    private String provinceName;
    private String status;
    private Long employeeCount;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}