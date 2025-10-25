package pe.edu.vallegrande.project.service;

import net.sf.jasperreports.engine.JRException;
import pe.edu.vallegrande.project.model.Buy;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

public interface BuyService {

    List<Buy> findAll();

    Optional<Buy> findById(Long id);

    Buy save(Buy buy);

    Optional<Buy> update(Long id, Buy buy);

    boolean delete(Long id);

    // Generar reporte PDF por ID de compra
    byte[] exportBuyReportPdf(Integer id) throws FileNotFoundException, JRException;
}
