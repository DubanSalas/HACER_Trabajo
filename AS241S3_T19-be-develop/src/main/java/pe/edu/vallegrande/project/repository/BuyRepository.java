package pe.edu.vallegrande.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.vallegrande.project.model.Buy;
import java.util.List;

public interface BuyRepository extends JpaRepository<Buy, Long> {
    List<Buy> findByPaymentType(String paymentType);
}
