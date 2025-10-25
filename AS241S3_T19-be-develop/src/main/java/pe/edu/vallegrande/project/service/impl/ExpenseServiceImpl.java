package pe.edu.vallegrande.project.service.impl;

import pe.edu.vallegrande.project.model.Expense;
import pe.edu.vallegrande.project.repository.ExpenseRepository;
import pe.edu.vallegrande.project.service.ExpenseService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public List<Expense> findAll() {
        return expenseRepository.findAll();
    }

    @Override
    public Optional<Expense> findById(Long id) {
        return expenseRepository.findById(id);
    }

    @Override
    public Expense save(Expense expense) {
        return expenseRepository.save(expense);
    }

    @Override
    public Expense update(Long id, Expense expense) {
        Optional<Expense> existing = expenseRepository.findById(id);
        if (existing.isPresent()) {
            Expense e = existing.get();
            e.setIdEmployee(expense.getIdEmployee());
            e.setDescription(expense.getDescription());
            e.setAmount(expense.getAmount());
            e.setExpenseDate(expense.getExpenseDate());
            return expenseRepository.save(e);
        } else {
            return null;
        }
    }

    @Override
    public void delete(Long id) {
        expenseRepository.deleteById(id);
    }
}
