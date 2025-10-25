package pe.edu.vallegrande.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pe.edu.vallegrande.project.model.Employee;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByStatus(String status);
    List<Employee> findByStatusNot(String status);
    
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Optional<Employee> findByDocumentNumber(String documentNumber);
    Optional<Employee> findByEmail(String email);
    
    List<Employee> findByLocationIdLocation(Long locationId);
    List<Employee> findByPositionIdPosition(Long positionId);
    
    @Query("SELECT e FROM Employee e WHERE " +
           "(LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.surname) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "e.status = :status")
    List<Employee> findBySearchAndStatus(@Param("search") String search, @Param("status") String status);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.status = :status")
    Long countByStatus(@Param("status") String status);
    
    @Query("SELECT AVG(e.salary) FROM Employee e WHERE e.status = 'A'")
    BigDecimal getAverageSalary();
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.position.idPosition = :positionId")
    Long countByPosition(@Param("positionId") Long positionId);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.location.idLocation = :locationId")
    Long countByLocation(@Param("locationId") Long locationId);
    
    // Dashboard specific queries
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.status = 'A'")
    Long countActiveEmployees();
}
