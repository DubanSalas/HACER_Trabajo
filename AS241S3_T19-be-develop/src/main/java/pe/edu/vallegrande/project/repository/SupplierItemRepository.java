package pe.edu.vallegrande.project.repository;

import pe.edu.vallegrande.project.model.SupplierItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupplierItemRepository extends JpaRepository<SupplierItem, Long> {
    List<SupplierItem> findByStatus(String status);
    List<SupplierItem> findBySupplierIdSupplier(Long supplierId);
    List<SupplierItem> findBySupplierIdSupplierAndStatus(Long supplierId, String status);
}