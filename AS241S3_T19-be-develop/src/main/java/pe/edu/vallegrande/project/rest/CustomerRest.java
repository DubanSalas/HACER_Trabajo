package pe.edu.vallegrande.project.rest;

import pe.edu.vallegrande.project.dto.CustomerDTO;
import pe.edu.vallegrande.project.dto.CustomerRequest;
import pe.edu.vallegrande.project.dto.CustomerSummaryDTO;
import pe.edu.vallegrande.project.service.CustomerService;
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
@RequestMapping("/v1/api/customer")
public class CustomerRest {

    private final CustomerService customerService;

    @Autowired
    public CustomerRest(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> findAll() {
        List<CustomerDTO> customers = customerService.findAll();
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> findById(@PathVariable Long id) {
        Optional<CustomerDTO> customer = customerService.findById(id);
        return customer.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/client-code/{clientCode}")
    public ResponseEntity<CustomerDTO> findByClientCode(@PathVariable String clientCode) {
        Optional<CustomerDTO> customer = customerService.findByClientCode(clientCode);
        return customer.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CustomerDTO>> findByStatus(@PathVariable String status) {
        List<CustomerDTO> customers = customerService.findByStatus(status);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<CustomerDTO>> findByDepartment(@PathVariable String department) {
        List<CustomerDTO> customers = customerService.findByDepartment(department);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/province/{province}")
    public ResponseEntity<List<CustomerDTO>> findByProvince(@PathVariable String province) {
        List<CustomerDTO> customers = customerService.findByProvince(province);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<CustomerDTO>> findByDistrict(@PathVariable String district) {
        List<CustomerDTO> customers = customerService.findByDistrict(district);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<CustomerDTO>> findByLocation(@PathVariable Long locationId) {
        List<CustomerDTO> customers = customerService.findByLocation(locationId);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/search")
    public ResponseEntity<List<CustomerDTO>> searchCustomers(
            @RequestParam String search,
            @RequestParam(defaultValue = "A") String status) {
        List<CustomerDTO> customers = customerService.searchCustomers(search, status);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/summary")
    public ResponseEntity<CustomerSummaryDTO> getSummary() {
        CustomerSummaryDTO summary = customerService.getSummary();
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/save")
    public ResponseEntity<CustomerDTO> save(@Valid @RequestBody CustomerRequest customerRequest) {
        // Validate unique constraints
        if (customerService.existsByClientCode(customerRequest.getClientCode())) {
            return ResponseEntity.badRequest().build();
        }
        if (customerService.existsByDocumentNumber(customerRequest.getDocumentNumber())) {
            return ResponseEntity.badRequest().build();
        }
        if (customerService.existsByEmail(customerRequest.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        
        CustomerDTO savedCustomer = customerService.save(customerRequest);
        return ResponseEntity.ok(savedCustomer);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CustomerDTO> update(@PathVariable Long id, 
                                             @Valid @RequestBody CustomerRequest customerRequest) {
        CustomerDTO updatedCustomer = customerService.update(id, customerRequest);
        if (updatedCustomer != null) {
            return ResponseEntity.ok(updatedCustomer);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/restore/{id}")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        customerService.restore(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/exists/client-code/{clientCode}")
    public ResponseEntity<Boolean> existsByClientCode(@PathVariable String clientCode) {
        boolean exists = customerService.existsByClientCode(clientCode);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/exists/document/{documentNumber}")
    public ResponseEntity<Boolean> existsByDocumentNumber(@PathVariable String documentNumber) {
        boolean exists = customerService.existsByDocumentNumber(documentNumber);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Boolean> existsByEmail(@PathVariable String email) {
        boolean exists = customerService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/generate-code")
    public ResponseEntity<String> generateNextClientCode() {
        String nextCode = customerService.generateNextClientCode();
        return ResponseEntity.ok(nextCode);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> generateJasperPdfReport() {
        try {
            byte[] pdf = customerService.generateJasperPdfReport();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_clientes.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
