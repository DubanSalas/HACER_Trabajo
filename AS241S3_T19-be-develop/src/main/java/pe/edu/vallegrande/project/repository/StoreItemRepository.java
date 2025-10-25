package pe.edu.vallegrande.project.repository;

import pe.edu.vallegrande.project.model.StoreItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoreItemRepository extends JpaRepository<StoreItem, Long> {

    List<StoreItem> findByStatus(String status);
    List<StoreItem> findByStatusNot(String status);
    
    Optional<StoreItem> findByItemCode(String itemCode);
    List<StoreItem> findByCategory(String category);
    List<StoreItem> findByProductNameContainingIgnoreCase(String productName);
    List<StoreItem> findBySupplierIdSupplier(Long supplierId);
    
    boolean existsByItemCode(String itemCode);
    boolean existsByProductNameIgnoreCase(String productName);

    // Dashboard queries
    @Query("SELECT COUNT(s) FROM StoreItem s WHERE s.status = :status")
    Long countByStatus(@Param("status") String status);
    
    @Query("SELECT COUNT(s) FROM StoreItem s WHERE s.currentStock > 0")
    Long countAvailableProducts();
    
    @Query("SELECT COUNT(s) FROM StoreItem s WHERE s.currentStock <= s.minimumStock AND s.currentStock > 0")
    Long countLowStock();
    
    @Query("SELECT COUNT(s) FROM StoreItem s WHERE s.currentStock = 0")
    Long countOutOfStock();
    
    @Query("SELECT COUNT(s) FROM StoreItem s WHERE s.expiryDate BETWEEN CURRENT_DATE AND :date")
    Long countNearExpiry(@Param("date") LocalDate date);
    
    @Query("SELECT SUM(s.currentStock * s.unitPrice) FROM StoreItem s WHERE s.status != 'Agotado'")
    BigDecimal getTotalInventoryValue();

    // Items with low stock (using 15 as threshold for dashboard)
    @Query("SELECT s FROM StoreItem s WHERE s.currentStock <= 15 AND s.currentStock > 0 ORDER BY s.currentStock ASC")
    List<StoreItem> findLowStockItems();

    // Items near expiry
    @Query("SELECT s FROM StoreItem s WHERE s.expiryDate BETWEEN CURRENT_DATE AND :date ORDER BY s.expiryDate ASC")
    List<StoreItem> findNearExpiryItems(@Param("date") LocalDate date);

    // Items out of stock
    @Query("SELECT s FROM StoreItem s WHERE s.currentStock = 0")
    List<StoreItem> findOutOfStockItems();

    // Search functionality
    @Query("SELECT s FROM StoreItem s WHERE " +
           "(LOWER(s.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.itemCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.category) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "s.status = :status")
    List<StoreItem> findBySearchAndStatus(@Param("search") String search, @Param("status") String status);

    // Find by location
    List<StoreItem> findByLocationContainingIgnoreCase(String location);
    
    // Dashboard specific query for stock by product name
    @Query("SELECT s.currentStock FROM StoreItem s WHERE s.productName = :productName")
    Integer findStockByProductName(@Param("productName") String productName);
}