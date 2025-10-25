package pe.edu.vallegrande.project.service;

import pe.edu.vallegrande.project.model.PurchaseDetail;
import java.util.List;
import java.util.Optional;

public interface PurchaseDetailService {

    List<PurchaseDetail> findAll();

    Optional<PurchaseDetail> findById(Long id);

    List<PurchaseDetail> findByBuyId(Long buyId);

    PurchaseDetail save(PurchaseDetail purchaseDetail);

    Optional<PurchaseDetail> update(Long id, PurchaseDetail purchaseDetail);

    boolean delete(Long id);
}
