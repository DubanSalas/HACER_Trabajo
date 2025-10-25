package pe.edu.vallegrande.project.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.project.model.Employee;
import pe.edu.vallegrande.project.model.Location;
import pe.edu.vallegrande.project.model.Position;
import pe.edu.vallegrande.project.repository.EmployeeRepository;
import pe.edu.vallegrande.project.repository.LocationRepository;
import pe.edu.vallegrande.project.repository.PositionRepository;
import pe.edu.vallegrande.project.service.EmployeeService;
import pe.edu.vallegrande.project.dto.EmployeeDTO;
import pe.edu.vallegrande.project.dto.EmployeeRequest;
import pe.edu.vallegrande.project.dto.EmployeeSummaryDTO;
import pe.edu.vallegrande.project.dto.PositionSummaryDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final LocationRepository locationRepository;
    private final PositionRepository positionRepository;

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                              LocationRepository locationRepository,
                              PositionRepository positionRepository) {
        this.employeeRepository = employeeRepository;
        this.locationRepository = locationRepository;
        this.positionRepository = positionRepository;
    }

    @Override
    public List<EmployeeDTO> findAll() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EmployeeDTO> findById(Long id) {
        return employeeRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<EmployeeDTO> findByStatus(String status) {
        return employeeRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeDTO> findByLocation(Long locationId) {
        return employeeRepository.findByLocationIdLocation(locationId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeDTO> findByPosition(Long positionId) {
        return employeeRepository.findByPositionIdPosition(positionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeDTO> searchEmployees(String search, String status) {
        return employeeRepository.findBySearchAndStatus(search, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO save(EmployeeRequest employeeRequest) {
        Employee employee = convertToEntity(employeeRequest);
        employee.setStatus("A");
        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDTO(savedEmployee);
    }

    @Override
    public EmployeeDTO update(Long id, EmployeeRequest employeeRequest) {
        Optional<Employee> existing = employeeRepository.findById(id);
        if (existing.isPresent()) {
            Employee employee = existing.get();
            updateEmployeeFromRequest(employee, employeeRequest);
            Employee updatedEmployee = employeeRepository.save(employee);
            return convertToDTO(updatedEmployee);
        }
        return null;
    }

    @Override
    public void delete(Long id) {
        Optional<Employee> existing = employeeRepository.findById(id);
        existing.ifPresent(e -> {
            e.setStatus("I");
            employeeRepository.save(e);
        });
    }

    @Override
    public void restore(Long id) {
        Optional<Employee> existing = employeeRepository.findById(id);
        existing.ifPresent(e -> {
            e.setStatus("A");
            employeeRepository.save(e);
        });
    }

    @Override
    public EmployeeSummaryDTO getSummary() {
        Long total = employeeRepository.count();
        Long active = employeeRepository.countByStatus("A");
        Long inactive = employeeRepository.countByStatus("I");
        BigDecimal averageSalary = employeeRepository.getAverageSalary();
        
        return new EmployeeSummaryDTO(total, active, inactive, averageSalary);
    }

    @Override
    public List<PositionSummaryDTO> getPositionSummary() {
        return positionRepository.findByStatus("A").stream()
                .map(position -> {
                    Long count = employeeRepository.countByPosition(position.getIdPosition());
                    return new PositionSummaryDTO(position.getPositionName(), count);
                })
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmployeeCode(String employeeCode) {
        return employeeRepository.findByEmployeeCode(employeeCode).isPresent();
    }

    @Override
    public boolean existsByDocumentNumber(String documentNumber) {
        return employeeRepository.findByDocumentNumber(documentNumber).isPresent();
    }

    @Override
    public boolean existsByEmail(String email) {
        return employeeRepository.findByEmail(email).isPresent();
    }

    private EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setIdEmployee(employee.getIdEmployee());
        dto.setEmployeeCode(employee.getEmployeeCode());
        dto.setDocumentType(employee.getDocumentType());
        dto.setDocumentNumber(employee.getDocumentNumber());
        dto.setName(employee.getName());
        dto.setSurname(employee.getSurname());
        dto.setHireDate(employee.getHireDate());
        dto.setPhone(employee.getPhone());
        dto.setSalary(employee.getSalary());
        dto.setEmail(employee.getEmail());
        dto.setStatus(employee.getStatus());

        if (employee.getLocation() != null) {
            dto.setLocationId(employee.getLocation().getIdLocation());
            dto.setDepartment(employee.getLocation().getDepartment());
            dto.setProvince(employee.getLocation().getProvince());
            dto.setDistrict(employee.getLocation().getDistrict());
            dto.setAddress(employee.getLocation().getAddress());
        }

        if (employee.getPosition() != null) {
            dto.setPositionId(employee.getPosition().getIdPosition());
            dto.setPositionName(employee.getPosition().getPositionName());
        }

        return dto;
    }

    private Employee convertToEntity(EmployeeRequest request) {
        Employee employee = new Employee();
        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setDocumentType(request.getDocumentType());
        employee.setDocumentNumber(request.getDocumentNumber());
        employee.setName(request.getName());
        employee.setSurname(request.getSurname());
        employee.setHireDate(request.getHireDate());
        employee.setPhone(request.getPhone());
        employee.setSalary(request.getSalary());
        employee.setEmail(request.getEmail());
        employee.setStatus(request.getStatus());

        // Set relationships
        if (request.getLocationId() != null) {
            Location location = locationRepository.findById(request.getLocationId()).orElse(null);
            employee.setLocation(location);
        }

        if (request.getPositionId() != null) {
            Position position = positionRepository.findById(request.getPositionId()).orElse(null);
            employee.setPosition(position);
        }

        return employee;
    }

    private void updateEmployeeFromRequest(Employee employee, EmployeeRequest request) {
        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setDocumentType(request.getDocumentType());
        employee.setDocumentNumber(request.getDocumentNumber());
        employee.setName(request.getName());
        employee.setSurname(request.getSurname());
        employee.setHireDate(request.getHireDate());
        employee.setPhone(request.getPhone());
        employee.setSalary(request.getSalary());
        employee.setEmail(request.getEmail());
        employee.setStatus(request.getStatus());

        // Update relationships
        if (request.getLocationId() != null) {
            Location location = locationRepository.findById(request.getLocationId()).orElse(null);
            employee.setLocation(location);
        }

        if (request.getPositionId() != null) {
            Position position = positionRepository.findById(request.getPositionId()).orElse(null);
            employee.setPosition(position);
        }
    }
}
