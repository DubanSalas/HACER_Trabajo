package pe.edu.vallegrande.project.service.impl;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.util.JRLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.project.model.Buy;
import pe.edu.vallegrande.project.repository.BuyRepository;
import pe.edu.vallegrande.project.service.BuyService;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class BuyServiceImpl implements BuyService {

    private final BuyRepository buyRepository;

    @Autowired
    public BuyServiceImpl(BuyRepository buyRepository) {
        this.buyRepository = buyRepository;
    }

    @Override
    public List<Buy> findAll() {
        return buyRepository.findAll();
    }

    @Override
    public Optional<Buy> findById(Long id) {
        return buyRepository.findById(id);
    }

    @Override
    public Buy save(Buy buy) {
        return buyRepository.save(buy);
    }

    @Override
    public Optional<Buy> update(Long id, Buy buy) {
        return buyRepository.findById(id).map(existingBuy -> {
            existingBuy.setIdSupplier(buy.getIdSupplier());
            existingBuy.setPurchaseDate(buy.getPurchaseDate());
            existingBuy.setTotalAmount(buy.getTotalAmount());
            existingBuy.setPaymentType(buy.getPaymentType());
            return buyRepository.save(existingBuy);
        });
    }

    @Override
    public boolean delete(Long id) {
        if (buyRepository.existsById(id)) {
            buyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public byte[] exportBuyReportPdf(Integer id) throws FileNotFoundException, JRException {
        Optional<Buy> optionalBuy = buyRepository.findById(Long.valueOf(id));
        if (optionalBuy.isEmpty()) {
            throw new IllegalArgumentException("Compra no encontrada con ID: " + id);
        }

        Buy buy = optionalBuy.get();
        List<Buy> dataList = Collections.singletonList(buy);

        try (InputStream reportStream = getClass().getResourceAsStream("../../../../../../../resources/reports/compraRepo.jasper")) {
            if (reportStream == null) {
                throw new FileNotFoundException("No se encontró el archivo Jasper en /reports/compraRepo.jasper");
            }

            JasperReport jasperReport = (JasperReport) JRLoader.loadObject(reportStream);
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(dataList);

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("createdBy", "Delipedidos");

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (IOException e) {
            // Envolvemos IOException en RuntimeException ya que no puede ser lanzada aquí
            throw new RuntimeException("Error al cargar el reporte Jasper", e);
        }
    }
}
