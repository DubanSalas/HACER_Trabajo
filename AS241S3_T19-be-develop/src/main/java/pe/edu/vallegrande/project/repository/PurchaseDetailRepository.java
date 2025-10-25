package pe.edu.vallegrande.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.vallegrande.project.model.PurchaseDetail;

import java.util.List;

public interface PurchaseDetailRepository extends JpaRepository<PurchaseDetail, Long> {

    // Buscar detalles por id de compra usando la relación JPA
    List<PurchaseDetail> findByBuyId(Long buyId);

}
