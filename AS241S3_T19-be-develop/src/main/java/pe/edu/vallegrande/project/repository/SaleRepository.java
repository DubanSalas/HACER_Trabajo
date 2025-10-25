package pe.edu.vallegrande.project.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pe.edu.vallegrande.project.model.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findByStatus(String status);
    Optional<Sale> findBySaleCode(String saleCode);
    List<Sale> findByCustomerIdCustomer(Long customerId);
    List<Sale> findByEmployeeIdEmployee(Long employeeId);
    List<Sale> findByPaymentMethod(String paymentMethod);
    List<Sale> findBySaleDate(LocalDate saleDate);
    
    @Query("SELECT s.saleCode FROM Sale s ORDER BY s.idSale DESC")
    Optional<String> findLatestSaleCode();

    // Dashboard queries
    @Query("SELECT COUNT(s) FROM Sale s WHERE s.status = :status")
    Long countByStatus(@Param("status") String status);
    
    @Query("SELECT SUM(s.total) FROM Sale s WHERE s.status = 'Completado'")
    BigDecimal getTotalSalesAmount();
    
    @Query("SELECT SUM(s.total) FROM Sale s WHERE s.saleDate = CURRENT_DATE AND s.status = 'Completado'")
    BigDecimal getTodaySalesAmount();
    
    @Query("SELECT COUNT(s) FROM Sale s WHERE s.saleDate = CURRENT_DATE")
    Long getTodaySalesCount();

    // Date-based queries
    @Query("SELECT COUNT(s) FROM Sale s WHERE s.saleDate = :date")
    Long countByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(s) FROM Sale s WHERE YEAR(s.saleDate) = :year AND MONTH(s.saleDate) = :month")
    Long countByMonth(@Param("year") int year, @Param("month") int month);

    @Query("SELECT COUNT(s) FROM Sale s WHERE YEAR(s.saleDate) = :year")
    Long countByYear(@Param("year") int year);

    @Query("SELECT s FROM Sale s ORDER BY s.saleDate DESC, s.idSale DESC")
    List<Sale> findLastSales(Pageable pageable);

    // Search functionality
    @Query("SELECT s FROM Sale s WHERE " +
           "(LOWER(s.saleCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.customer.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.customer.surname) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "s.status = :status")
    List<Sale> findBySearchAndStatus(@Param("search") String search, @Param("status") String status);
    
    // Dashboard specific queries
    @Query("SELECT COUNT(s) FROM Sale s WHERE DATE(s.saleDate) = :date")
    Long countSalesByDate(@Param("date") LocalDate date);
    
    @Query("SELECT s FROM Sale s LEFT JOIN FETCH s.details LEFT JOIN FETCH s.customer " +
           "ORDER BY s.saleDate DESC, s.idSale DESC")
    List<Sale> findRecentSalesWithDetails();
    
    @Query("SELECT p.productName, SUM(sd.quantity) as totalVendido " +
           "FROM SaleDetail sd " +
           "JOIN sd.product p " +
           "JOIN sd.sale s " +
           "WHERE s.status = 'Completado' " +
           "GROUP BY p.idProduct, p.productName " +
           "ORDER BY totalVendido DESC")
    List<Object[]> findTopSellingProducts();
}
