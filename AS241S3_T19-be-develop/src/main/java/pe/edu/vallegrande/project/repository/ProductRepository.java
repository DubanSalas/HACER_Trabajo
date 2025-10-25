package pe.edu.vallegrande.project.repository;

import pe.edu.vallegrande.project.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStatus(String status);
    Optional<Product> findByProductCode(String productCode);
    List<Product> findByCategory(String category);
    boolean existsByProductCode(String productCode);
}
