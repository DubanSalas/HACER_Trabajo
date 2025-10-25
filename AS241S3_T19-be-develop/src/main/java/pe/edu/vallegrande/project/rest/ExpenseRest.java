package pe.edu.vallegrande.project.rest;

import pe.edu.vallegrande.project.model.Expense;
import pe.edu.vallegrande.project.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/expense")
public class ExpenseRest {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseRest(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<Expense> findAll() {
        return expenseService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Expense> findById(@PathVariable Long id) {
        return expenseService.findById(id);
    }

    @PostMapping("/save")
    public Expense save(@RequestBody Expense expense) {
        return expenseService.save(expense);
    }

    @PutMapping("/update/{id}")
    public Expense update(@PathVariable Long id, @RequestBody Expense expense) {
        return expenseService.update(id, expense);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        expenseService.delete(id);
    }
}
