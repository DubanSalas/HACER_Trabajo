package pe.edu.vallegrande.project.rest;

import pe.edu.vallegrande.project.dto.SupplierDTO;
import pe.edu.vallegrande.project.dto.SupplierRequest;
import pe.edu.vallegrande.project.dto.SupplierSummaryDTO;
import pe.edu.vallegrande.project.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/supplier")
public class SupplierRest {

    private final SupplierService supplierService;

    @Autowired
    public SupplierRest(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public ResponseEntity<List<SupplierDTO>> findAll() {
        List<SupplierDTO> suppliers = supplierService.findAll();
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SupplierDTO>> getAllSuppliers() {
        List<SupplierDTO> suppliers = supplierService.findAll();
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierDTO> findById(@PathVariable Long id) {
        Optional<SupplierDTO> supplier = supplierService.findById(id);
        return supplier.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SupplierDTO>> findByStatus(@PathVariable String status) {
        List<SupplierDTO> suppliers = supplierService.findByStatus(status);
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<SupplierDTO>> findByCategory(@PathVariable String category) {
        List<SupplierDTO> suppliers = supplierService.findByCategory(category);
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/payment-terms/{paymentTerms}")
    public ResponseEntity<List<SupplierDTO>> findByPaymentTerms(@PathVariable String paymentTerms) {
        List<SupplierDTO> suppliers = supplierService.findByPaymentTerms(paymentTerms);
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<SupplierDTO>> findByLocation(@PathVariable Long locationId) {
        List<SupplierDTO> suppliers = supplierService.findByLocation(locationId);
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SupplierDTO>> searchSuppliers(
            @RequestParam String search,
            @RequestParam(defaultValue = "A") String status) {
        List<SupplierDTO> suppliers = supplierService.searchSuppliers(search, status);
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/summary")
    public ResponseEntity<SupplierSummaryDTO> getSummary() {
        SupplierSummaryDTO summary = supplierService.getSummary();
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/save")
    public ResponseEntity<SupplierDTO> save(@Valid @RequestBody SupplierRequest supplierRequest) {
        // Validate unique constraints
        if (supplierService.existsByEmail(supplierRequest.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        
        SupplierDTO savedSupplier = supplierService.save(supplierRequest);
        return ResponseEntity.ok(savedSupplier);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SupplierDTO> update(@PathVariable Long id, 
                                             @Valid @RequestBody SupplierRequest supplierRequest) {
        SupplierDTO updatedSupplier = supplierService.update(id, supplierRequest);
        if (updatedSupplier != null) {
            return ResponseEntity.ok(updatedSupplier);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/restore/{id}")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        supplierService.restore(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/suspend/{id}")
    public ResponseEntity<Void> suspend(@PathVariable Long id) {
        supplierService.suspend(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Boolean> existsByEmail(@PathVariable String email) {
        boolean exists = supplierService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }
}
