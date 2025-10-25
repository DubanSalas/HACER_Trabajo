package pe.edu.vallegrande.project.service.impl;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.vallegrande.project.model.Product;
import pe.edu.vallegrande.project.repository.ProductRepository;
import pe.edu.vallegrande.project.service.ProductService;
import pe.edu.vallegrande.project.dto.ProductDTO;
import pe.edu.vallegrande.project.dto.ProductRequest;
import pe.edu.vallegrande.project.dto.ProductSummaryDTO;
import pe.edu.vallegrande.project.dto.TopProductDTO;

import javax.sql.DataSource;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final DataSource dataSource;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, DataSource dataSource) {
        this.productRepository = productRepository;
        this.dataSource = dataSource;
    }

    @Override
    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProductDTO> findById(Long id) {
        return productRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public Optional<ProductDTO> findByProductCode(String productCode) {
        return productRepository.findByProductCode(productCode)
                .map(this::convertToDTO);
    }

    @Override
    public List<ProductDTO> findByStatus(String status) {
        return productRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> findByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> searchProducts(String search, String status) {
        // Implementación simple usando findByStatus por ahora
        return productRepository.findByStatus(status).stream()
                .filter(product -> 
                    product.getProductName().toLowerCase().contains(search.toLowerCase()) ||
                    product.getProductCode().toLowerCase().contains(search.toLowerCase()) ||
                    product.getCategory().toLowerCase().contains(search.toLowerCase())
                )
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductDTO save(ProductRequest productRequest) {
        Product product = convertToEntity(productRequest);
        product.setStatus("A");
        product.setStock(productRequest.getInitialStock()); // Set initial stock as current stock
        
        // Generate product code if not provided
        if (product.getProductCode() == null || product.getProductCode().isEmpty()) {
            product.setProductCode(generateNextProductCode());
        }
        
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Override
    @Transactional
    public ProductDTO update(Long id, ProductRequest productRequest) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isPresent()) {
            Product product = existing.get();
            updateProductFromRequest(product, productRequest);
            Product updatedProduct = productRepository.save(product);
            return convertToDTO(updatedProduct);
        }
        return null;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Optional<Product> existing = productRepository.findById(id);
        existing.ifPresent(p -> {
            p.setStatus("I");
            productRepository.save(p);
        });
    }

    @Override
    @Transactional
    public void restore(Long id) {
        Optional<Product> existing = productRepository.findById(id);
        existing.ifPresent(p -> {
            p.setStatus("A");
            productRepository.save(p);
        });
    }

    @Override
    public ProductSummaryDTO getSummary() {
        List<Product> allProducts = productRepository.findAll();
        Long total = (long) allProducts.size();
        
        Long available = allProducts.stream()
                .filter(p -> p.getStock() > 0 && "A".equals(p.getStatus()))
                .count();
                
        Long lowStock = allProducts.stream()
                .filter(p -> p.isLowStock() && "A".equals(p.getStatus()))
                .count();
                
        Long outOfStock = allProducts.stream()
                .filter(p -> p.isOutOfStock() && "A".equals(p.getStatus()))
                .count();
                
        var totalValue = allProducts.stream()
                .filter(p -> "A".equals(p.getStatus()))
                .map(Product::getTotalStockValue)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
                
        var averagePrice = allProducts.stream()
                .filter(p -> "A".equals(p.getStatus()))
                .map(Product::getPrice)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add)
                .divide(java.math.BigDecimal.valueOf(Math.max(1, available)), java.math.RoundingMode.HALF_UP);
        
        return new ProductSummaryDTO(total, available, lowStock, outOfStock, 
                                   totalValue != null ? totalValue : java.math.BigDecimal.ZERO,
                                   averagePrice != null ? averagePrice : java.math.BigDecimal.ZERO);
    }

    @Override
    public List<TopProductDTO> getTopProductsByStock(int limit) {
        return productRepository.findByStatus("A").stream()
                .sorted((p1, p2) -> Integer.compare(p2.getStock(), p1.getStock()))
                .limit(limit)
                .map(p -> new TopProductDTO(p.getProductName(), p.getStock(), p.getCategory()))
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByProductName(String productName) {
        // Implementación simple usando findAll y filtro
        return productRepository.findAll().stream()
                .anyMatch(product -> product.getProductName().equalsIgnoreCase(productName));
    }

    @Override
    public boolean existsByProductCode(String productCode) {
        return productRepository.existsByProductCode(productCode);
    }

    @Override
    public String generateNextProductCode() {
        // Generate a simple product code like P001, P002, etc.
        long count = productRepository.count();
        return String.format("P%03d", count + 1);
    }

    @Override
    @Transactional
    public ProductDTO updateStock(Long id, Integer newStock) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isPresent()) {
            Product product = existing.get();
            product.setStock(newStock);
            Product updatedProduct = productRepository.save(product);
            return convertToDTO(updatedProduct);
        }
        return null;
    }

    @Override
    @Transactional
    public ProductDTO addStock(Long id, Integer quantity) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isPresent()) {
            Product product = existing.get();
            product.setStock(product.getStock() + quantity);
            Product updatedProduct = productRepository.save(product);
            return convertToDTO(updatedProduct);
        }
        return null;
    }

    @Override
    @Transactional
    public ProductDTO reduceStock(Long id, Integer quantity) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isPresent()) {
            Product product = existing.get();
            int newStock = Math.max(0, product.getStock() - quantity);
            product.setStock(newStock);
            Product updatedProduct = productRepository.save(product);
            return convertToDTO(updatedProduct);
        }
        return null;
    }

    @Override
    public byte[] generateJasperPdfReport() throws Exception {
        ClassPathResource resource = new ClassPathResource("reports/product_report.jasper");
        InputStream jasperStream = resource.getInputStream();
        
        HashMap<String, Object> parameters = new HashMap<>();
        parameters.put("title", "Reporte de Productos");
        
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, parameters, dataSource.getConnection());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setIdProduct(product.getIdProduct());
        dto.setProductCode(product.getProductCode());
        dto.setProductName(product.getProductName());
        dto.setCategory(product.getCategory());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setInitialStock(product.getInitialStock());
        dto.setImageUrl(product.getImageUrl());
        dto.setStatus(product.getStatus());
        
        // Calcular valores de forma segura
        try {
            dto.setTotalStockValue(product.getTotalStockValue());
        } catch (Exception e) {
            dto.setTotalStockValue(BigDecimal.ZERO);
        }
        
        try {
            dto.setLowStock(product.isLowStock());
        } catch (Exception e) {
            dto.setLowStock(false);
        }
        
        try {
            dto.setOutOfStock(product.isOutOfStock());
        } catch (Exception e) {
            dto.setOutOfStock(false);
        }
        
        return dto;
    }

    private Product convertToEntity(ProductRequest request) {
        Product product = new Product();
        product.setProductCode(request.getProductCode());
        product.setProductName(request.getProductName());
        product.setCategory(request.getCategory());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setInitialStock(request.getInitialStock());
        product.setImageUrl(request.getImageUrl());
        product.setStatus(request.getStatus());
        return product;
    }

    private void updateProductFromRequest(Product product, ProductRequest request) {
        product.setProductCode(request.getProductCode());
        product.setProductName(request.getProductName());
        product.setCategory(request.getCategory());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setStatus(request.getStatus());
        // Note: We don't update initialStock or current stock in regular updates
    }
}