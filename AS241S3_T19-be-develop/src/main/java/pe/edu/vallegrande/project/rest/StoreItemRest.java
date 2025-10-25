package pe.edu.vallegrande.project.rest;

import pe.edu.vallegrande.project.dto.StoreItemDTO;
import pe.edu.vallegrande.project.dto.StoreItemRequest;
import pe.edu.vallegrande.project.dto.StoreSummaryDTO;
import pe.edu.vallegrande.project.service.StoreItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/store-item")
public class StoreItemRest {

    private final StoreItemService storeItemService;

    @Autowired
    public StoreItemRest(StoreItemService storeItemService) {
        this.storeItemService = storeItemService;
    }

    @GetMapping
    public ResponseEntity<List<StoreItemDTO>> findAll() {
        List<StoreItemDTO> items = storeItemService.findAll();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreItemDTO> findById(@PathVariable Long id) {
        Optional<StoreItemDTO> item = storeItemService.findById(id);
        return item.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{itemCode}")
    public ResponseEntity<StoreItemDTO> findByItemCode(@PathVariable String itemCode) {
        Optional<StoreItemDTO> item = storeItemService.findByItemCode(itemCode);
        return item.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<StoreItemDTO>> findByStatus(@PathVariable String status) {
        List<StoreItemDTO> items = storeItemService.findByStatus(status);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<StoreItemDTO>> findByCategory(@PathVariable String category) {
        List<StoreItemDTO> items = storeItemService.findByCategory(category);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<StoreItemDTO>> findBySupplier(@PathVariable Long supplierId) {
        List<StoreItemDTO> items = storeItemService.findBySupplier(supplierId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<StoreItemDTO>> findByLocation(@PathVariable String location) {
        List<StoreItemDTO> items = storeItemService.findByLocation(location);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/search")
    public ResponseEntity<List<StoreItemDTO>> searchItems(
            @RequestParam String search,
            @RequestParam(defaultValue = "Disponible") String status) {
        List<StoreItemDTO> items = storeItemService.searchItems(search, status);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<StoreItemDTO>> findLowStockItems() {
        List<StoreItemDTO> items = storeItemService.findLowStockItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<List<StoreItemDTO>> findOutOfStockItems() {
        List<StoreItemDTO> items = storeItemService.findOutOfStockItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/near-expiry")
    public ResponseEntity<List<StoreItemDTO>> findNearExpiryItems() {
        List<StoreItemDTO> items = storeItemService.findNearExpiryItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/summary")
    public ResponseEntity<StoreSummaryDTO> getSummary() {
        StoreSummaryDTO summary = storeItemService.getSummary();
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/save")
    public ResponseEntity<StoreItemDTO> save(@Valid @RequestBody StoreItemRequest storeItemRequest) {
        // Validate unique constraints
        if (storeItemRequest.getItemCode() != null && storeItemService.existsByItemCode(storeItemRequest.getItemCode())) {
            return ResponseEntity.badRequest().build();
        }
        
        StoreItemDTO savedItem = storeItemService.save(storeItemRequest);
        return ResponseEntity.ok(savedItem);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<StoreItemDTO> update(@PathVariable Long id, 
                                              @Valid @RequestBody StoreItemRequest storeItemRequest) {
        StoreItemDTO updatedItem = storeItemService.update(id, storeItemRequest);
        if (updatedItem != null) {
            return ResponseEntity.ok(updatedItem);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        storeItemService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/restore/{id}")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        storeItemService.restore(id);
        return ResponseEntity.ok().build();
    }

    // Stock management endpoints
    @PutMapping("/{id}/stock")
    public ResponseEntity<StoreItemDTO> updateStock(@PathVariable Long id, 
                                                   @RequestParam Integer newStock) {
        StoreItemDTO updatedItem = storeItemService.updateStock(id, newStock);
        if (updatedItem != null) {
            return ResponseEntity.ok(updatedItem);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/add-stock")
    public ResponseEntity<StoreItemDTO> addStock(@PathVariable Long id, 
                                                @RequestParam Integer quantity) {
        StoreItemDTO updatedItem = storeItemService.addStock(id, quantity);
        if (updatedItem != null) {
            return ResponseEntity.ok(updatedItem);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/reduce-stock")
    public ResponseEntity<StoreItemDTO> reduceStock(@PathVariable Long id, 
                                                   @RequestParam Integer quantity) {
        StoreItemDTO updatedItem = storeItemService.reduceStock(id, quantity);
        if (updatedItem != null) {
            return ResponseEntity.ok(updatedItem);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/exists/code/{itemCode}")
    public ResponseEntity<Boolean> existsByItemCode(@PathVariable String itemCode) {
        boolean exists = storeItemService.existsByItemCode(itemCode);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/exists/name/{productName}")
    public ResponseEntity<Boolean> existsByProductName(@PathVariable String productName) {
        boolean exists = storeItemService.existsByProductName(productName);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/generate-code")
    public ResponseEntity<String> generateNextItemCode() {
        String nextCode = storeItemService.generateNextItemCode();
        return ResponseEntity.ok(nextCode);
    }
}