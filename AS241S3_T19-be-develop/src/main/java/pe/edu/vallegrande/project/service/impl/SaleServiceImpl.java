package pe.edu.vallegrande.project.service.impl;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.vallegrande.project.model.*;
import pe.edu.vallegrande.project.repository.*;
import pe.edu.vallegrande.project.service.SaleService;
import pe.edu.vallegrande.project.service.ProductService;
import pe.edu.vallegrande.project.dto.*;

import javax.sql.DataSource;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final DataSource dataSource;

    @Autowired
    public SaleServiceImpl(SaleRepository saleRepository,
            CustomerRepository customerRepository,
            EmployeeRepository employeeRepository,
            ProductRepository productRepository,
            ProductService productService,
            DataSource dataSource) {
        this.saleRepository = saleRepository;
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
        this.productRepository = productRepository;
        this.productService = productService;
        this.dataSource = dataSource;
    }

    @Override
    public List<SaleDTO> findAll() {
        return saleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<SaleDTO> findById(Long id) {
        return saleRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public Optional<SaleDTO> findBySaleCode(String saleCode) {
        return saleRepository.findBySaleCode(saleCode)
                .map(this::convertToDTO);
    }

    @Override
    public List<SaleDTO> findByStatus(String status) {
        return saleRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SaleDTO> findByCustomer(Long customerId) {
        return saleRepository.findByCustomerIdCustomer(customerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SaleDTO> findByEmployee(Long employeeId) {
        return saleRepository.findByEmployeeIdEmployee(employeeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SaleDTO> findByPaymentMethod(String paymentMethod) {
        return saleRepository.findByPaymentMethod(paymentMethod).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SaleDTO> searchSales(String search, String status) {
        return saleRepository.findBySearchAndStatus(search, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SaleDTO save(SaleRequest saleRequest) {
        Sale sale = convertToEntity(saleRequest);

        // Generate sale code if not provided
        if (sale.getSaleCode() == null || sale.getSaleCode().isEmpty()) {
            sale.setSaleCode(generateNextSaleCode());
        }

        // Save sale first
        Sale savedSale = saleRepository.save(sale);

        // Process sale details
        for (SaleDetailRequest detailRequest : saleRequest.getDetails()) {
            SaleDetail detail = new SaleDetail();
            detail.setSale(savedSale);

            Product product = productRepository.findById(detailRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            detail.setProduct(product);
            detail.setQuantity(detailRequest.getQuantity());
            detail.setUnitPrice(detailRequest.getUnitPrice());
            detail.calculateSubtotal();

            savedSale.addDetail(detail);

            // Reduce product stock
            productService.reduceStock(product.getIdProduct(), detailRequest.getQuantity());
        }

        // Recalculate and save total
        savedSale.calculateTotal();
        savedSale = saleRepository.save(savedSale);

        return convertToDTO(savedSale);
    }

    @Override
    @Transactional
    public SaleDTO update(Long id, SaleRequest saleRequest) {
        Optional<Sale> existing = saleRepository.findById(id);
        if (existing.isPresent()) {
            Sale sale = existing.get();

            // Restore stock from previous details
            for (SaleDetail detail : sale.getDetails()) {
                productService.addStock(detail.getProduct().getIdProduct(), detail.getQuantity());
            }

            // Clear existing details
            sale.getDetails().clear();

            // Update sale fields
            updateSaleFromRequest(sale, saleRequest);

            // Add new details
            for (SaleDetailRequest detailRequest : saleRequest.getDetails()) {
                SaleDetail detail = new SaleDetail();
                detail.setSale(sale);

                Product product = productRepository.findById(detailRequest.getProductId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                detail.setProduct(product);
                detail.setQuantity(detailRequest.getQuantity());
                detail.setUnitPrice(detailRequest.getUnitPrice());
                detail.calculateSubtotal();

                sale.addDetail(detail);

                // Reduce product stock
                productService.reduceStock(product.getIdProduct(), detailRequest.getQuantity());
            }

            // Recalculate and save total
            sale.calculateTotal();
            Sale updatedSale = saleRepository.save(sale);
            return convertToDTO(updatedSale);
        }
        return null;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Optional<Sale> existing = saleRepository.findById(id);
        existing.ifPresent(s -> {
            // Restore stock from details
            for (SaleDetail detail : s.getDetails()) {
                productService.addStock(detail.getProduct().getIdProduct(), detail.getQuantity());
            }
            s.setStatus("Cancelado");
            saleRepository.save(s);
        });
    }

    @Override
    @Transactional
    public void restore(Long id) {
        Optional<Sale> existing = saleRepository.findById(id);
        existing.ifPresent(s -> {
            // Reduce stock again
            for (SaleDetail detail : s.getDetails()) {
                productService.reduceStock(detail.getProduct().getIdProduct(), detail.getQuantity());
            }
            s.setStatus("Completado");
            saleRepository.save(s);
        });
    }

    @Override
    public SaleSummaryDTO getSummary() {
        BigDecimal totalSales = saleRepository.getTotalSalesAmount();
        BigDecimal todaySales = saleRepository.getTodaySalesAmount();
        Long completedSales = saleRepository.countByStatus("Completado");
        Long pendingSales = saleRepository.countByStatus("Pendiente");

        return new SaleSummaryDTO(
                totalSales != null ? totalSales : BigDecimal.ZERO,
                todaySales != null ? todaySales : BigDecimal.ZERO,
                completedSales != null ? completedSales : 0L,
                pendingSales != null ? pendingSales : 0L);
    }

    @Override
    public boolean existsBySaleCode(String saleCode) {
        return saleRepository.findBySaleCode(saleCode).isPresent();
    }

    @Override
    public String generateNextSaleCode() {
        Optional<String> latestCode = saleRepository.findLatestSaleCode();
        if (latestCode.isPresent()) {
            String code = latestCode.get();
            // Extract number from code (assuming format like "V001", "V002", etc.)
            String numberPart = code.substring(1);
            int nextNumber = Integer.parseInt(numberPart) + 1;
            return String.format("V%03d", nextNumber);
        } else {
            return "V001";
        }
    }

    @Override
    public byte[] generateJasperPdfReport() throws Exception {
        ClassPathResource resource = new ClassPathResource("reports/sale_report.jasper");
        InputStream jasperStream = resource.getInputStream();

        HashMap<String, Object> parameters = new HashMap<>();
        parameters.put("title", "Reporte de Ventas");

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, parameters, dataSource.getConnection());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    @Override
    public byte[] generateJasperPdfReportBySaleId(Long saleId) throws Exception {
        ClassPathResource resource = new ClassPathResource("reports/sale_detail_report.jasper");
        InputStream jasperStream = resource.getInputStream();

        HashMap<String, Object> parameters = new HashMap<>();
        parameters.put("saleId", saleId);

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, parameters, dataSource.getConnection());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    private SaleDTO convertToDTO(Sale sale) {
        SaleDTO dto = new SaleDTO();
        dto.setIdSale(sale.getIdSale());
        dto.setSaleCode(sale.getSaleCode());
        dto.setSaleDate(sale.getSaleDate());
        dto.setPaymentMethod(sale.getPaymentMethod());
        dto.setStatus(sale.getStatus());
        dto.setTotal(sale.getTotal());

        if (sale.getCustomer() != null) {
            dto.setCustomerId(sale.getCustomer().getIdCustomer());
            dto.setCustomerName(sale.getCustomer().getName());
            dto.setCustomerSurname(sale.getCustomer().getSurname());
            dto.setCustomerFullName(sale.getCustomer().getName() + " " + sale.getCustomer().getSurname());
        }

        if (sale.getEmployee() != null) {
            dto.setEmployeeId(sale.getEmployee().getIdEmployee());
            dto.setEmployeeName(sale.getEmployee().getName());
            dto.setEmployeeSurname(sale.getEmployee().getSurname());
            dto.setEmployeeFullName(sale.getEmployee().getName() + " " + sale.getEmployee().getSurname());
        }

        if (sale.getDetails() != null) {
            dto.setDetails(sale.getDetails().stream()
                    .map(this::convertDetailToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private SaleDetailDTO convertDetailToDTO(SaleDetail detail) {
        SaleDetailDTO dto = new SaleDetailDTO();
        dto.setIdSaleDetail(detail.getIdSaleDetail());
        dto.setSaleId(detail.getSale().getIdSale());
        dto.setQuantity(detail.getQuantity());
        dto.setUnitPrice(detail.getUnitPrice());
        dto.setSubtotal(detail.getSubtotal());

        if (detail.getProduct() != null) {
            dto.setProductId(detail.getProduct().getIdProduct());
            dto.setProductName(detail.getProduct().getProductName());
            dto.setProductCode(detail.getProduct().getProductCode());
        }

        return dto;
    }

    private Sale convertToEntity(SaleRequest request) {
        Sale sale = new Sale();
        sale.setSaleCode(request.getSaleCode());
        sale.setSaleDate(request.getSaleDate() != null ? request.getSaleDate() : LocalDate.now());
        sale.setPaymentMethod(request.getPaymentMethod());
        sale.setStatus(request.getStatus());

        // Set relationships
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            sale.setCustomer(customer);
        }

        if (request.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
            sale.setEmployee(employee);
        }

        return sale;
    }

    private void updateSaleFromRequest(Sale sale, SaleRequest request) {
        sale.setSaleCode(request.getSaleCode());
        sale.setSaleDate(request.getSaleDate() != null ? request.getSaleDate() : sale.getSaleDate());
        sale.setPaymentMethod(request.getPaymentMethod());
        sale.setStatus(request.getStatus());

        // Update relationships
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            sale.setCustomer(customer);
        }

        if (request.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
            sale.setEmployee(employee);
        }
    }
}