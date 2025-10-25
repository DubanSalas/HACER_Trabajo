package pe.edu.vallegrande.project.service;

import pe.edu.vallegrande.project.dto.EmployeeDTO;
import pe.edu.vallegrande.project.dto.EmployeeRequest;
import pe.edu.vallegrande.project.dto.EmployeeSummaryDTO;
import pe.edu.vallegrande.project.dto.PositionSummaryDTO;
import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    List<EmployeeDTO> findAll();
    Optional<EmployeeDTO> findById(Long id);
    List<EmployeeDTO> findByStatus(String status);
    List<EmployeeDTO> findByLocation(Long locationId);
    List<EmployeeDTO> findByPosition(Long positionId);
    List<EmployeeDTO> searchEmployees(String search, String status);
    
    EmployeeDTO save(EmployeeRequest employeeRequest);
    EmployeeDTO update(Long id, EmployeeRequest employeeRequest);
    void delete(Long id);
    void restore(Long id);
    
    EmployeeSummaryDTO getSummary();
    List<PositionSummaryDTO> getPositionSummary();
    boolean existsByEmployeeCode(String employeeCode);
    boolean existsByDocumentNumber(String documentNumber);
    boolean existsByEmail(String email);
}
