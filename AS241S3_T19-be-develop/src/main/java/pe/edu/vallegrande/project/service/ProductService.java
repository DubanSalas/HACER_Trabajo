package pe.edu.vallegrande.project.service;

import pe.edu.vallegrande.project.dto.ProductDTO;
import pe.edu.vallegrande.project.dto.ProductRequest;
import pe.edu.vallegrande.project.dto.ProductSummaryDTO;
import pe.edu.vallegrande.project.dto.TopProductDTO;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<ProductDTO> findAll();
    Optional<ProductDTO> findById(Long id);
    Optional<ProductDTO> findByProductCode(String productCode);
    List<ProductDTO> findByStatus(String status);
    List<ProductDTO> findByCategory(String category);
    List<ProductDTO> searchProducts(String search, String status);
    
    ProductDTO save(ProductRequest productRequest);
    ProductDTO update(Long id, ProductRequest productRequest);
    void delete(Long id);
    void restore(Long id);
    
    ProductSummaryDTO getSummary();
    List<TopProductDTO> getTopProductsByStock(int limit);
    boolean existsByProductName(String productName);
    boolean existsByProductCode(String productCode);
    String generateNextProductCode();
    
    // Stock management
    ProductDTO updateStock(Long id, Integer newStock);
    ProductDTO addStock(Long id, Integer quantity);
    ProductDTO reduceStock(Long id, Integer quantity);
    
    byte[] generateJasperPdfReport() throws Exception;
}
