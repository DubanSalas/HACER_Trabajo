package pe.edu.vallegrande.project.rest;

import pe.edu.vallegrande.project.dto.ProductDTO;
import pe.edu.vallegrande.project.dto.ProductRequest;
import pe.edu.vallegrande.project.dto.ProductSummaryDTO;
import pe.edu.vallegrande.project.dto.TopProductDTO;
import pe.edu.vallegrande.project.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/product")
public class ProductRest {

    private final ProductService productService;

    @Autowired
    public ProductRest(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> findAll() {
        List<ProductDTO> products = productService.findAll();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable Long id) {
        Optional<ProductDTO> product = productService.findById(id);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{productCode}")
    public ResponseEntity<ProductDTO> findByProductCode(@PathVariable String productCode) {
        Optional<ProductDTO> product = productService.findByProductCode(productCode);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProductDTO>> findByStatus(@PathVariable String status) {
        List<ProductDTO> products = productService.findByStatus(status);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDTO>> findByCategory(@PathVariable String category) {
        List<ProductDTO> products = productService.findByCategory(category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(
            @RequestParam String search,
            @RequestParam(defaultValue = "A") String status) {
        List<ProductDTO> products = productService.searchProducts(search, status);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/summary")
    public ResponseEntity<ProductSummaryDTO> getSummary() {
        ProductSummaryDTO summary = productService.getSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/top-stock")
    public ResponseEntity<List<TopProductDTO>> getTopProductsByStock(
            @RequestParam(defaultValue = "4") int limit) {
        List<TopProductDTO> topProducts = productService.getTopProductsByStock(limit);
        return ResponseEntity.ok(topProducts);
    }

    @PostMapping("/save")
    public ResponseEntity<ProductDTO> save(@Valid @RequestBody ProductRequest productRequest) {
        // Validate unique constraints
        if (productService.existsByProductCode(productRequest.getProductCode())) {
            return ResponseEntity.badRequest().build();
        }
        if (productService.existsByProductName(productRequest.getProductName())) {
            return ResponseEntity.badRequest().build();
        }
        
        ProductDTO savedProduct = productService.save(productRequest);
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductDTO> update(@PathVariable Long id, 
                                           @Valid @RequestBody ProductRequest productRequest) {
        ProductDTO updatedProduct = productService.update(id, productRequest);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/restore/{id}")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        productService.restore(id);
        return ResponseEntity.ok().build();
    }

    // Stock management endpoints
    @PutMapping("/{id}/stock")
    public ResponseEntity<ProductDTO> updateStock(@PathVariable Long id, 
                                                 @RequestParam Integer newStock) {
        ProductDTO updatedProduct = productService.updateStock(id, newStock);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/add-stock")
    public ResponseEntity<ProductDTO> addStock(@PathVariable Long id, 
                                              @RequestParam Integer quantity) {
        ProductDTO updatedProduct = productService.addStock(id, quantity);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/reduce-stock")
    public ResponseEntity<ProductDTO> reduceStock(@PathVariable Long id, 
                                                 @RequestParam Integer quantity) {
        ProductDTO updatedProduct = productService.reduceStock(id, quantity);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/exists/code/{productCode}")
    public ResponseEntity<Boolean> existsByProductCode(@PathVariable String productCode) {
        boolean exists = productService.existsByProductCode(productCode);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/exists/name/{productName}")
    public ResponseEntity<Boolean> existsByProductName(@PathVariable String productName) {
        boolean exists = productService.existsByProductName(productName);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/generate-code")
    public ResponseEntity<String> generateNextProductCode() {
        String nextCode = productService.generateNextProductCode();
        return ResponseEntity.ok(nextCode);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> generateJasperPdfReport() {
        try {
            byte[] pdf = productService.generateJasperPdfReport();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_productos.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
