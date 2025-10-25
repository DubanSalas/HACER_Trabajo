package pe.edu.vallegrande.project.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {
    
    // Métricas principales
    private Long ventasDelDia;
    private String porcentajeVentasAyer;
    private Long totalClientes;
    private String porcentajeClientesAyer;
    private Long totalEmpleados;
    private String porcentajeEmpleadosAyer;
    private Long totalProductos;
    private Long productosDisponibles;
    
    // Listas detalladas
    private List<VentaRecienteDTO> ventasRecientes;
    private List<ProductoMasVendidoDTO> productosMasVendidos;
    private List<AlertaStockDTO> alertasStock;
    
    // Constructors
    public DashboardResponse() {}
    
    public DashboardResponse(Long ventasDelDia, String porcentajeVentasAyer, Long totalClientes, 
                           String porcentajeClientesAyer, Long totalEmpleados, String porcentajeEmpleadosAyer,
                           Long totalProductos, Long productosDisponibles, List<VentaRecienteDTO> ventasRecientes,
                           List<ProductoMasVendidoDTO> productosMasVendidos, List<AlertaStockDTO> alertasStock) {
        this.ventasDelDia = ventasDelDia;
        this.porcentajeVentasAyer = porcentajeVentasAyer;
        this.totalClientes = totalClientes;
        this.porcentajeClientesAyer = porcentajeClientesAyer;
        this.totalEmpleados = totalEmpleados;
        this.porcentajeEmpleadosAyer = porcentajeEmpleadosAyer;
        this.totalProductos = totalProductos;
        this.productosDisponibles = productosDisponibles;
        this.ventasRecientes = ventasRecientes;
        this.productosMasVendidos = productosMasVendidos;
        this.alertasStock = alertasStock;
    }
    
    // Getters and Setters
    public Long getVentasDelDia() { return ventasDelDia; }
    public void setVentasDelDia(Long ventasDelDia) { this.ventasDelDia = ventasDelDia; }
    
    public String getPorcentajeVentasAyer() { return porcentajeVentasAyer; }
    public void setPorcentajeVentasAyer(String porcentajeVentasAyer) { this.porcentajeVentasAyer = porcentajeVentasAyer; }
    
    public Long getTotalClientes() { return totalClientes; }
    public void setTotalClientes(Long totalClientes) { this.totalClientes = totalClientes; }
    
    public String getPorcentajeClientesAyer() { return porcentajeClientesAyer; }
    public void setPorcentajeClientesAyer(String porcentajeClientesAyer) { this.porcentajeClientesAyer = porcentajeClientesAyer; }
    
    public Long getTotalEmpleados() { return totalEmpleados; }
    public void setTotalEmpleados(Long totalEmpleados) { this.totalEmpleados = totalEmpleados; }
    
    public String getPorcentajeEmpleadosAyer() { return porcentajeEmpleadosAyer; }
    public void setPorcentajeEmpleadosAyer(String porcentajeEmpleadosAyer) { this.porcentajeEmpleadosAyer = porcentajeEmpleadosAyer; }
    
    public Long getTotalProductos() { return totalProductos; }
    public void setTotalProductos(Long totalProductos) { this.totalProductos = totalProductos; }
    
    public Long getProductosDisponibles() { return productosDisponibles; }
    public void setProductosDisponibles(Long productosDisponibles) { this.productosDisponibles = productosDisponibles; }
    
    public List<VentaRecienteDTO> getVentasRecientes() { return ventasRecientes; }
    public void setVentasRecientes(List<VentaRecienteDTO> ventasRecientes) { this.ventasRecientes = ventasRecientes; }
    
    public List<ProductoMasVendidoDTO> getProductosMasVendidos() { return productosMasVendidos; }
    public void setProductosMasVendidos(List<ProductoMasVendidoDTO> productosMasVendidos) { this.productosMasVendidos = productosMasVendidos; }
    
    public List<AlertaStockDTO> getAlertasStock() { return alertasStock; }
    public void setAlertasStock(List<AlertaStockDTO> alertasStock) { this.alertasStock = alertasStock; }
    
    // DTOs internos
    public static class VentaRecienteDTO {
        private String clienteNombre;
        private Integer cantidadProductos;
        private BigDecimal montoTotal;
        private String estado;
        
        public VentaRecienteDTO() {}
        
        public VentaRecienteDTO(String clienteNombre, Integer cantidadProductos, BigDecimal montoTotal, String estado) {
            this.clienteNombre = clienteNombre;
            this.cantidadProductos = cantidadProductos;
            this.montoTotal = montoTotal;
            this.estado = estado;
        }
        
        // Getters and Setters
        public String getClienteNombre() { return clienteNombre; }
        public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }
        
        public Integer getCantidadProductos() { return cantidadProductos; }
        public void setCantidadProductos(Integer cantidadProductos) { this.cantidadProductos = cantidadProductos; }
        
        public BigDecimal getMontoTotal() { return montoTotal; }
        public void setMontoTotal(BigDecimal montoTotal) { this.montoTotal = montoTotal; }
        
        public String getEstado() { return estado; }
        public void setEstado(String estado) { this.estado = estado; }
    }
    
    public static class ProductoMasVendidoDTO {
        private String nombreProducto;
        private Integer stockActual;
        private Integer cantidadVendida;
        
        public ProductoMasVendidoDTO() {}
        
        public ProductoMasVendidoDTO(String nombreProducto, Integer stockActual, Integer cantidadVendida) {
            this.nombreProducto = nombreProducto;
            this.stockActual = stockActual;
            this.cantidadVendida = cantidadVendida;
        }
        
        // Getters and Setters
        public String getNombreProducto() { return nombreProducto; }
        public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }
        
        public Integer getStockActual() { return stockActual; }
        public void setStockActual(Integer stockActual) { this.stockActual = stockActual; }
        
        public Integer getCantidadVendida() { return cantidadVendida; }
        public void setCantidadVendida(Integer cantidadVendida) { this.cantidadVendida = cantidadVendida; }
    }
    
    public static class AlertaStockDTO {
        private String nombreProducto;
        private Integer stockActual;
        private String tipoAlerta; // "STOCK_BAJO", "PROXIMO_VENCER"
        
        public AlertaStockDTO() {}
        
        public AlertaStockDTO(String nombreProducto, Integer stockActual, String tipoAlerta) {
            this.nombreProducto = nombreProducto;
            this.stockActual = stockActual;
            this.tipoAlerta = tipoAlerta;
        }
        
        // Getters and Setters
        public String getNombreProducto() { return nombreProducto; }
        public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }
        
        public Integer getStockActual() { return stockActual; }
        public void setStockActual(Integer stockActual) { this.stockActual = stockActual; }
        
        public String getTipoAlerta() { return tipoAlerta; }
        public void setTipoAlerta(String tipoAlerta) { this.tipoAlerta = tipoAlerta; }
    }
}