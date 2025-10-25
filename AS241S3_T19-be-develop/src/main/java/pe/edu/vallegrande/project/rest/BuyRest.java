package pe.edu.vallegrande.project.rest;

import net.sf.jasperreports.engine.JRException;
import pe.edu.vallegrande.project.model.Buy;
import pe.edu.vallegrande.project.service.BuyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/buys")
public class BuyRest {

    private final BuyService buyService;

    @Autowired
    public BuyRest(BuyService buyService) {
        this.buyService = buyService;
    }

    @GetMapping
    public ResponseEntity<List<Buy>> findAll() {
        List<Buy> buys = buyService.findAll();
        if (buys.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(buys);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Buy> findById(@PathVariable Long id) {
        Optional<Buy> buy = buyService.findById(id);
        return buy.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/save")
    public ResponseEntity<Buy> save(@RequestBody Buy buy) {
        Buy savedBuy = buyService.save(buy);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBuy);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Buy> update(@PathVariable Long id, @RequestBody Buy buy) {
        Optional<Buy> updatedBuy = buyService.update(id, buy);
        return updatedBuy.map(ResponseEntity::ok)
                         .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = buyService.delete(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Nuevo endpoint para generar el PDF del reporte de compra por ID
    @GetMapping("/report/{id}")
    public ResponseEntity<byte[]> exportBuyReportPdf(@PathVariable Integer id) {
        try {
            byte[] pdf = buyService.exportBuyReportPdf(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition
                    .builder("inline")
                    .filename("buy_report_" + id + ".pdf")
                    .build());

            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (FileNotFoundException | JRException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
