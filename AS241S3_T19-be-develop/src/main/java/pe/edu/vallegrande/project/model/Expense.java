package pe.edu.vallegrande.project.model;

import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "expense")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Expense", nullable = false)
    private Long idExpense;

    @Column(name = "id_Employee", nullable = false)
    private Long idEmployee;  // Lo puse Long para consistencia con usuales IDs

    @Column(name = "Description", nullable = false, length = 50)
    private String description;

    @Column(name = "Amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "Expense_Date", nullable = false)
    private LocalDate expenseDate;
}
