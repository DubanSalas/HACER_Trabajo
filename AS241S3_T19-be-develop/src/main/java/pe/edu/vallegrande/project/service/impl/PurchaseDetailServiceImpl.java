package pe.edu.vallegrande.project.service.impl;

import pe.edu.vallegrande.project.model.PurchaseDetail;
import pe.edu.vallegrande.project.repository.PurchaseDetailRepository;
import pe.edu.vallegrande.project.service.PurchaseDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PurchaseDetailServiceImpl implements PurchaseDetailService {

    private final PurchaseDetailRepository purchaseDetailRepository;

    @Autowired
    public PurchaseDetailServiceImpl(PurchaseDetailRepository purchaseDetailRepository) {
        this.purchaseDetailRepository = purchaseDetailRepository;
    }

    @Override
    public List<PurchaseDetail> findAll() {
        return purchaseDetailRepository.findAll();
    }

    @Override
    public Optional<PurchaseDetail> findById(Long id) {
        return purchaseDetailRepository.findById(id);
    }

    @Override
    public List<PurchaseDetail> findByBuyId(Long buyId) {
        return purchaseDetailRepository.findByBuyId(buyId);
    }

    @Override
    public PurchaseDetail save(PurchaseDetail purchaseDetail) {
        return purchaseDetailRepository.save(purchaseDetail);
    }

    @Override
    public Optional<PurchaseDetail> update(Long id, PurchaseDetail purchaseDetail) {
        Optional<PurchaseDetail> existing = purchaseDetailRepository.findById(id);
        if (existing.isPresent()) {
            PurchaseDetail pd = existing.get();
            pd.setBuy(purchaseDetail.getBuy());       // asumiendo relación ManyToOne a Buy
            pd.setIdProduct(purchaseDetail.getIdProduct());
            pd.setAmount(purchaseDetail.getAmount());
            pd.setSubtotal(purchaseDetail.getSubtotal());
            return Optional.of(purchaseDetailRepository.save(pd));
        }
        return Optional.empty();
    }

    @Override
    public boolean delete(Long id) {
        Optional<PurchaseDetail> existing = purchaseDetailRepository.findById(id);
        if (existing.isPresent()) {
            purchaseDetailRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
