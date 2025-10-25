package pe.edu.vallegrande.project.rest;

import pe.edu.vallegrande.project.model.PurchaseDetail;
import pe.edu.vallegrande.project.service.PurchaseDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/purchase-details")
public class PurchaseDetailRest {

    private final PurchaseDetailService purchaseDetailService;

    @Autowired
    public PurchaseDetailRest(PurchaseDetailService purchaseDetailService) {
        this.purchaseDetailService = purchaseDetailService;
    }

    @GetMapping
    public ResponseEntity<List<PurchaseDetail>> findAll() {
        List<PurchaseDetail> details = purchaseDetailService.findAll();
        if (details.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(details);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseDetail> findById(@PathVariable Long id) {
        Optional<PurchaseDetail> detail = purchaseDetailService.findById(id);
        return detail.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/buy/{buyId}")
    public ResponseEntity<List<PurchaseDetail>> findByBuyId(@PathVariable Long buyId) {
        List<PurchaseDetail> details = purchaseDetailService.findByBuyId(buyId);
        if (details.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(details);
    }

    @PostMapping("/save")
    public ResponseEntity<PurchaseDetail> save(@RequestBody PurchaseDetail purchaseDetail) {
        PurchaseDetail savedDetail = purchaseDetailService.save(purchaseDetail);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDetail);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PurchaseDetail> update(@PathVariable Long id, @RequestBody PurchaseDetail purchaseDetail) {
        Optional<PurchaseDetail> updatedDetail = purchaseDetailService.update(id, purchaseDetail);
        return updatedDetail.map(ResponseEntity::ok)
                            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = purchaseDetailService.delete(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
