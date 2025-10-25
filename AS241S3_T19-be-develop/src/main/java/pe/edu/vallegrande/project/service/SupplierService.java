package pe.edu.vallegrande.project.service;

import pe.edu.vallegrande.project.dto.SupplierDTO;
import pe.edu.vallegrande.project.dto.SupplierRequest;
import pe.edu.vallegrande.project.dto.SupplierSummaryDTO;
import java.util.List;
import java.util.Optional;

public interface SupplierService {
    List<SupplierDTO> findAll();
    Optional<SupplierDTO> findById(Long id);
    List<SupplierDTO> findByStatus(String status);
    List<SupplierDTO> findByCategory(String category);
    List<SupplierDTO> findByPaymentTerms(String paymentTerms);
    List<SupplierDTO> findByLocation(Long locationId);
    List<SupplierDTO> searchSuppliers(String search, String status);
    
    SupplierDTO save(SupplierRequest supplierRequest);
    SupplierDTO update(Long id, SupplierRequest supplierRequest);
    void delete(Long id);
    void restore(Long id);
    void suspend(Long id);
    
    SupplierSummaryDTO getSummary();
    boolean existsByEmail(String email);
}
