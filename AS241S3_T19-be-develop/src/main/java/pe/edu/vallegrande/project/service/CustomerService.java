package pe.edu.vallegrande.project.service;

import pe.edu.vallegrande.project.dto.CustomerDTO;
import pe.edu.vallegrande.project.dto.CustomerRequest;
import pe.edu.vallegrande.project.dto.CustomerSummaryDTO;
import java.util.List;
import java.util.Optional;

public interface CustomerService {
    List<CustomerDTO> findAll();
    Optional<CustomerDTO> findById(Long id);
    Optional<CustomerDTO> findByClientCode(String clientCode);
    List<CustomerDTO> findByStatus(String status);
    List<CustomerDTO> findByDepartment(String department);
    List<CustomerDTO> findByProvince(String province);
    List<CustomerDTO> findByDistrict(String district);
    List<CustomerDTO> findByLocation(Long locationId);
    List<CustomerDTO> searchCustomers(String search, String status);
    
    CustomerDTO save(CustomerRequest customerRequest);
    CustomerDTO update(Long id, CustomerRequest customerRequest);
    void delete(Long id);
    void restore(Long id);
    
    CustomerSummaryDTO getSummary();
    boolean existsByClientCode(String clientCode);
    boolean existsByDocumentNumber(String documentNumber);
    boolean existsByEmail(String email);
    String generateNextClientCode();
    
    byte[] generateJasperPdfReport() throws Exception;
}
