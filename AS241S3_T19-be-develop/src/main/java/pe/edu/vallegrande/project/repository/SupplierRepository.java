package pe.edu.vallegrande.project.repository;

import pe.edu.vallegrande.project.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findByStatus(String status);
    List<Supplier> findByStatusNot(String status);
    
    Optional<Supplier> findByEmail(String email);
    
    List<Supplier> findByCompanyNameContainingIgnoreCase(String companyName);
    List<Supplier> findByContactNameContainingIgnoreCase(String contactName);
    List<Supplier> findByCategory(String category);
    List<Supplier> findByPaymentTerms(String paymentTerms);
    List<Supplier> findByLocationIdLocation(Long locationId);
    
    @Query("SELECT s FROM Supplier s WHERE " +
           "(LOWER(s.companyName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.contactName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "s.status = :status")
    List<Supplier> findBySearchAndStatus(@Param("search") String search, @Param("status") String status);
    
    @Query("SELECT COUNT(s) FROM Supplier s WHERE s.status = :status")
    Long countByStatus(@Param("status") String status);
}
