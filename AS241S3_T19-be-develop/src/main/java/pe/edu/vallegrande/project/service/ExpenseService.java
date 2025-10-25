package pe.edu.vallegrande.project.service;

import pe.edu.vallegrande.project.model.Expense;
import java.util.List;
import java.util.Optional;

public interface ExpenseService {

    List<Expense> findAll();

    Optional<Expense> findById(Long id);

    Expense save(Expense expense);

    Expense update(Long id, Expense expense);

    void delete(Long id);
}
