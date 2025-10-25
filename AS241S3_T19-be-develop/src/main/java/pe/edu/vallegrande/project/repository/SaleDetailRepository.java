package pe.edu.vallegrande.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pe.edu.vallegrande.project.model.SaleDetail;

import java.util.List;

public interface SaleDetailRepository extends JpaRepository<SaleDetail, Long> {

    List<SaleDetail> findBySaleIdSale(Long saleId);
    List<SaleDetail> findByProductIdProduct(Long productId);
    
    @Query("SELECT SUM(sd.quantity) FROM SaleDetail sd WHERE sd.product.idProduct = :productId")
    Integer getTotalQuantitySoldByProduct(@Param("productId") Long productId);
    
    @Query("SELECT sd FROM SaleDetail sd WHERE sd.sale.idSale = :saleId ORDER BY sd.idSaleDetail")
    List<SaleDetail> findBySaleIdOrderById(@Param("saleId") Long saleId);
}
