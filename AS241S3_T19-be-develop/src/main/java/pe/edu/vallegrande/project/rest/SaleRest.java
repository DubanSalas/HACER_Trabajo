package pe.edu.vallegrande.project.rest;

import pe.edu.vallegrande.project.dto.SaleDTO;
import pe.edu.vallegrande.project.dto.SaleRequest;
import pe.edu.vallegrande.project.dto.SaleSummaryDTO;
import pe.edu.vallegrande.project.service.SaleService;
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
@RequestMapping("/v1/api/sale")
public class SaleRest {

    private final SaleService saleService;

    @Autowired
    public SaleRest(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping
    public ResponseEntity<List<SaleDTO>> findAll() {
        List<SaleDTO> sales = saleService.findAll();
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaleDTO> findById(@PathVariable Long id) {
        Optional<SaleDTO> sale = saleService.findById(id);
        return sale.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{saleCode}")
    public ResponseEntity<SaleDTO> findBySaleCode(@PathVariable String saleCode) {
        Optional<SaleDTO> sale = saleService.findBySaleCode(saleCode);
        return sale.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SaleDTO>> findByStatus(@PathVariable String status) {
        List<SaleDTO> sales = saleService.findByStatus(status);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<SaleDTO>> findByCustomer(@PathVariable Long customerId) {
        List<SaleDTO> sales = saleService.findByCustomer(customerId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<SaleDTO>> findByEmployee(@PathVariable Long employeeId) {
        List<SaleDTO> sales = saleService.findByEmployee(employeeId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/payment-method/{paymentMethod}")
    public ResponseEntity<List<SaleDTO>> findByPaymentMethod(@PathVariable String paymentMethod) {
        List<SaleDTO> sales = saleService.findByPaymentMethod(paymentMethod);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SaleDTO>> searchSales(
            @RequestParam String search,
            @RequestParam(defaultValue = "Completado") String status) {
        List<SaleDTO> sales = saleService.searchSales(search, status);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/summary")
    public ResponseEntity<SaleSummaryDTO> getSummary() {
        SaleSummaryDTO summary = saleService.getSummary();
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/save")
    public ResponseEntity<SaleDTO> save(@Valid @RequestBody SaleRequest saleRequest) {
        // Validate unique constraints
        if (saleRequest.getSaleCode() != null && saleService.existsBySaleCode(saleRequest.getSaleCode())) {
            return ResponseEntity.badRequest().build();
        }
        
        SaleDTO savedSale = saleService.save(saleRequest);
        return ResponseEntity.ok(savedSale);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SaleDTO> update(@PathVariable Long id, 
                                         @Valid @RequestBody SaleRequest saleRequest) {
        SaleDTO updatedSale = saleService.update(id, saleRequest);
        if (updatedSale != null) {
            return ResponseEntity.ok(updatedSale);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        saleService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/restore/{id}")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        saleService.restore(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/exists/code/{saleCode}")
    public ResponseEntity<Boolean> existsBySaleCode(@PathVariable String saleCode) {
        boolean exists = saleService.existsBySaleCode(saleCode);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/generate-code")
    public ResponseEntity<String> generateNextSaleCode() {
        String nextCode = saleService.generateNextSaleCode();
        return ResponseEntity.ok(nextCode);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> generateJasperPdfReport() {
        try {
            byte[] pdf = saleService.generateJasperPdfReport();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_ventas.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/pdf/{saleId}")
    public ResponseEntity<byte[]> generatePdfBySaleId(@PathVariable Long saleId) {
        try {
            byte[] pdf = saleService.generateJasperPdfReportBySaleId(saleId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=venta_" + saleId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
