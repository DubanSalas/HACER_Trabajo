package pe.edu.vallegrande.project.service;

import pe.edu.vallegrande.project.dto.SaleDTO;
import pe.edu.vallegrande.project.dto.SaleRequest;
import pe.edu.vallegrande.project.dto.SaleSummaryDTO;
import java.util.List;
import java.util.Optional;

public interface SaleService {
    List<SaleDTO> findAll();
    Optional<SaleDTO> findById(Long id);
    Optional<SaleDTO> findBySaleCode(String saleCode);
    List<SaleDTO> findByStatus(String status);
    List<SaleDTO> findByCustomer(Long customerId);
    List<SaleDTO> findByEmployee(Long employeeId);
    List<SaleDTO> findByPaymentMethod(String paymentMethod);
    List<SaleDTO> searchSales(String search, String status);
    
    SaleDTO save(SaleRequest saleRequest);
    SaleDTO update(Long id, SaleRequest saleRequest);
    void delete(Long id);
    void restore(Long id);
    
    SaleSummaryDTO getSummary();
    boolean existsBySaleCode(String saleCode);
    String generateNextSaleCode();
    
    byte[] generateJasperPdfReport() throws Exception;
    byte[] generateJasperPdfReportBySaleId(Long saleId) throws Exception;
}
