package pe.edu.vallegrande.project.rest;

import pe.edu.vallegrande.project.dto.EmployeeDTO;
import pe.edu.vallegrande.project.dto.EmployeeRequest;
import pe.edu.vallegrande.project.dto.EmployeeSummaryDTO;
import pe.edu.vallegrande.project.dto.PositionSummaryDTO;
import pe.edu.vallegrande.project.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/employee")
public class EmployeeRest {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeRest(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> findAll() {
        List<EmployeeDTO> employees = employeeService.findAll();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> findById(@PathVariable Long id) {
        Optional<EmployeeDTO> employee = employeeService.findById(id);
        return employee.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<EmployeeDTO>> findByStatus(@PathVariable String status) {
        List<EmployeeDTO> employees = employeeService.findByStatus(status);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<EmployeeDTO>> findByLocation(@PathVariable Long locationId) {
        List<EmployeeDTO> employees = employeeService.findByLocation(locationId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/position/{positionId}")
    public ResponseEntity<List<EmployeeDTO>> findByPosition(@PathVariable Long positionId) {
        List<EmployeeDTO> employees = employeeService.findByPosition(positionId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EmployeeDTO>> searchEmployees(
            @RequestParam String search,
            @RequestParam(defaultValue = "A") String status) {
        List<EmployeeDTO> employees = employeeService.searchEmployees(search, status);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/summary")
    public ResponseEntity<EmployeeSummaryDTO> getSummary() {
        EmployeeSummaryDTO summary = employeeService.getSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/position-summary")
    public ResponseEntity<List<PositionSummaryDTO>> getPositionSummary() {
        List<PositionSummaryDTO> summary = employeeService.getPositionSummary();
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/save")
    public ResponseEntity<EmployeeDTO> save(@Valid @RequestBody EmployeeRequest employeeRequest) {
        // Validate unique constraints
        if (employeeService.existsByEmployeeCode(employeeRequest.getEmployeeCode())) {
            return ResponseEntity.badRequest().build();
        }
        if (employeeService.existsByDocumentNumber(employeeRequest.getDocumentNumber())) {
            return ResponseEntity.badRequest().build();
        }
        if (employeeService.existsByEmail(employeeRequest.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        
        EmployeeDTO savedEmployee = employeeService.save(employeeRequest);
        return ResponseEntity.ok(savedEmployee);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<EmployeeDTO> update(@PathVariable Long id, 
                                             @Valid @RequestBody EmployeeRequest employeeRequest) {
        EmployeeDTO updatedEmployee = employeeService.update(id, employeeRequest);
        if (updatedEmployee != null) {
            return ResponseEntity.ok(updatedEmployee);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/restore/{id}")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        employeeService.restore(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/exists/code/{employeeCode}")
    public ResponseEntity<Boolean> existsByEmployeeCode(@PathVariable String employeeCode) {
        boolean exists = employeeService.existsByEmployeeCode(employeeCode);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/exists/document/{documentNumber}")
    public ResponseEntity<Boolean> existsByDocumentNumber(@PathVariable String documentNumber) {
        boolean exists = employeeService.existsByDocumentNumber(documentNumber);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Boolean> existsByEmail(@PathVariable String email) {
        boolean exists = employeeService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }


}
