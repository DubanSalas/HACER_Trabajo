package pe.edu.vallegrande.project.dto;

import lombok.Data;
import java.util.List;

@Data
public class DashboardSummaryDTO {

    // KPIs clave
    private long totalSalesMonth;
    private long totalSalesDay;
    private long totalSalesYear;
    private long totalProductsInInventory;
    private long totalActiveClients;
    private long totalActiveEmployees;

    // Productos con stock crítico
    private List<ProductStockAlert> criticalStockProducts;

    // Últimas actividades
    private List<SaleSummary> recentSales;
    private List<ClientSummary> recentClients;

    @Data
    public static class ProductStockAlert {
        private long productId;
        private String productName;
        private int stockQuantity;
    }

    @Data
    public static class SaleSummary {
        private long saleId;
        private String clientName;
        private String saleDate; // o LocalDateTime si prefieres
        private double totalAmount;
    }

    @Data
    public static class ClientSummary {
        private long clientId;
        private String clientName;
        private String registrationDate; // o LocalDateTime
    }
}
