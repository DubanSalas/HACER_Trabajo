package pe.edu.vallegrande.project.dto;

import java.time.LocalDate;
import java.util.List;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class SaleResponse {

    private Long saleId;                  // ID de la venta
    private String customerName;          // Nombre del cliente
    private String employeeName;          // Nombre del empleado
    private LocalDate saleDate;           // Fecha de la venta
    private String paymentMethod;         // Método de pago
    private String status;                // Estado
    private BigDecimal total;             // Total de la venta (se agregará aquí el total calculado)
    private List<SaleDetailDto> details;  // Lista de detalles de productos

    // =========================
    // SUB DTO: Detalles de la Venta
    // =========================
    @Data
    public static class SaleDetailDto {
        private Long detailId;             // ID del detalle de la venta
        private String productName;        // Nombre del producto
        private BigDecimal price;          // Precio unitario
        private int quantity;              // Cantidad
        private BigDecimal subtotal;       // Subtotal = precio * cantidad
    }

    // =========================
    // SETTERS Y GETTERS
    // =========================

    public void setTotal(BigDecimal total) {
        this.total = total;  // Asignamos el total calculado
    }

    public BigDecimal getTotal() {
        return this.total;    // Obtenemos el total calculado
    }
}
