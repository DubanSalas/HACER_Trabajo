package pe.edu.vallegrande.project.repository;

import pe.edu.vallegrande.project.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // Consulta personalizada por idEmployee
    List<Expense> findByIdEmployee(Long idEmployee);
}
