package pe.edu.vallegrande.project.repository;

import pe.edu.vallegrande.project.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findByStatus(String status);
    List<Customer> findByStatusNot(String status);

    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByDocumentNumber(String documentNumber);
    Optional<Customer> findByClientCode(String clientCode);

    List<Customer> findAllByOrderByNameAsc();

    @Query("SELECT c.clientCode FROM Customer c ORDER BY c.idCustomer DESC")
    Optional<String> findLatestClientCode();

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = :status")
    Long countByStatus(@Param("status") String status);

    @Query("SELECT c FROM Customer c WHERE c.status = 'A' ORDER BY c.idCustomer DESC")
    List<Customer> findLastClients(Pageable pageable);

    // Filtros por ubicación
    List<Customer> findByLocationDepartment(String department);
    List<Customer> findByLocationProvince(String province);
    List<Customer> findByLocationDistrict(String district);
    List<Customer> findByLocationIdLocation(Long locationId);

    // Búsqueda
    @Query("SELECT c FROM Customer c WHERE " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.surname) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.clientCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "c.status = :status")
    List<Customer> findBySearchAndStatus(@Param("search") String search, @Param("status") String status);
    
    // Dashboard specific queries
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = 'A'")
    Long countActiveCustomers();
}
