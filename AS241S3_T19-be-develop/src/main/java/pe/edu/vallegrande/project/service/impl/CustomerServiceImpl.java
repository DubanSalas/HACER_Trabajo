package pe.edu.vallegrande.project.service.impl;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.vallegrande.project.model.Customer;
import pe.edu.vallegrande.project.model.Location;
import pe.edu.vallegrande.project.repository.CustomerRepository;
import pe.edu.vallegrande.project.repository.LocationRepository;
import pe.edu.vallegrande.project.service.CustomerService;
import pe.edu.vallegrande.project.dto.CustomerDTO;
import pe.edu.vallegrande.project.dto.CustomerRequest;
import pe.edu.vallegrande.project.dto.CustomerSummaryDTO;

import javax.sql.DataSource;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final LocationRepository locationRepository;
    private final DataSource dataSource;

    @Autowired
    public CustomerServiceImpl(CustomerRepository customerRepository,
                               LocationRepository locationRepository,
                               DataSource dataSource) {
        this.customerRepository = customerRepository;
        this.locationRepository = locationRepository;
        this.dataSource = dataSource;
    }

    @Override
    public List<CustomerDTO> findAll() {
        return customerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CustomerDTO> findById(Long id) {
        return customerRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public Optional<CustomerDTO> findByClientCode(String clientCode) {
        return customerRepository.findByClientCode(clientCode)
                .map(this::convertToDTO);
    }

    @Override
    public List<CustomerDTO> findByStatus(String status) {
        return customerRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDTO> findByDepartment(String department) {
        return customerRepository.findByLocationDepartment(department).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDTO> findByProvince(String province) {
        return customerRepository.findByLocationProvince(province).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDTO> findByDistrict(String district) {
        return customerRepository.findByLocationDistrict(district).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDTO> findByLocation(Long locationId) {
        return customerRepository.findByLocationIdLocation(locationId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDTO> searchCustomers(String search, String status) {
        return customerRepository.findBySearchAndStatus(search, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CustomerDTO save(CustomerRequest customerRequest) {
        Customer customer = convertToEntity(customerRequest);
        customer.setStatus("A");
        
        // Generate client code if not provided
        if (customer.getClientCode() == null || customer.getClientCode().isEmpty()) {
            customer.setClientCode(generateNextClientCode());
        }
        
        Customer savedCustomer = customerRepository.save(customer);
        return convertToDTO(savedCustomer);
    }

    @Override
    @Transactional
    public CustomerDTO update(Long id, CustomerRequest customerRequest) {
        Optional<Customer> existing = customerRepository.findById(id);
        if (existing.isPresent()) {
            Customer customer = existing.get();
            updateCustomerFromRequest(customer, customerRequest);
            Customer updatedCustomer = customerRepository.save(customer);
            return convertToDTO(updatedCustomer);
        }
        return null;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Optional<Customer> existing = customerRepository.findById(id);
        existing.ifPresent(c -> {
            c.setStatus("I");
            customerRepository.save(c);
        });
    }

    @Override
    @Transactional
    public void restore(Long id) {
        Optional<Customer> existing = customerRepository.findById(id);
        existing.ifPresent(c -> {
            c.setStatus("A");
            customerRepository.save(c);
        });
    }

    @Override
    public CustomerSummaryDTO getSummary() {
        Long total = customerRepository.count();
        Long active = customerRepository.countByStatus("A");
        Long inactive = customerRepository.countByStatus("I");
        
        // Count new customers this month
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        Long newThisMonth = customerRepository.findAll().stream()
                .filter(c -> c.getRegisterDate().isAfter(startOfMonth.minusDays(1)))
                .count();
        
        return new CustomerSummaryDTO(total, active, inactive, newThisMonth);
    }

    @Override
    public boolean existsByClientCode(String clientCode) {
        return customerRepository.findByClientCode(clientCode).isPresent();
    }

    @Override
    public boolean existsByDocumentNumber(String documentNumber) {
        return customerRepository.findByDocumentNumber(documentNumber).isPresent();
    }

    @Override
    public boolean existsByEmail(String email) {
        return customerRepository.findByEmail(email).isPresent();
    }

    @Override
    public String generateNextClientCode() {
        Optional<String> latestCode = customerRepository.findLatestClientCode();
        if (latestCode.isPresent()) {
            String code = latestCode.get();
            // Extract number from code (assuming format like "C001", "C002", etc.)
            String numberPart = code.substring(1);
            int nextNumber = Integer.parseInt(numberPart) + 1;
            return String.format("C%03d", nextNumber);
        } else {
            return "C001";
        }
    }

    @Override
    public byte[] generateJasperPdfReport() throws Exception {
        ClassPathResource resource = new ClassPathResource("reports/customer_report.jasper");
        InputStream jasperStream = resource.getInputStream();
        
        HashMap<String, Object> parameters = new HashMap<>();
        parameters.put("title", "Reporte de Clientes");
        
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, parameters, dataSource.getConnection());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setIdCustomer(customer.getIdCustomer());
        dto.setClientCode(customer.getClientCode());
        dto.setDocumentType(customer.getDocumentType());
        dto.setDocumentNumber(customer.getDocumentNumber());
        dto.setName(customer.getName());
        dto.setSurname(customer.getSurname());
        dto.setDateBirth(customer.getDateBirth());
        dto.setPhone(customer.getPhone());
        dto.setEmail(customer.getEmail());
        dto.setRegisterDate(customer.getRegisterDate());
        dto.setStatus(customer.getStatus());

        if (customer.getLocation() != null) {
            dto.setLocationId(customer.getLocation().getIdLocation());
            dto.setDepartment(customer.getLocation().getDepartment());
            dto.setProvince(customer.getLocation().getProvince());
            dto.setDistrict(customer.getLocation().getDistrict());
            dto.setLocationAddress(customer.getLocation().getAddress());
        }

        return dto;
    }

    private Customer convertToEntity(CustomerRequest request) {
        Customer customer = new Customer();
        customer.setClientCode(request.getClientCode());
        customer.setDocumentType(request.getDocumentType());
        customer.setDocumentNumber(request.getDocumentNumber());
        customer.setName(request.getName());
        customer.setSurname(request.getSurname());
        customer.setDateBirth(request.getDateBirth());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setStatus(request.getStatus());

        // Set location relationship
        if (request.getLocationId() != null) {
            Location location = locationRepository.findById(request.getLocationId()).orElse(null);
            customer.setLocation(location);
        }

        return customer;
    }

    private void updateCustomerFromRequest(Customer customer, CustomerRequest request) {
        customer.setClientCode(request.getClientCode());
        customer.setDocumentType(request.getDocumentType());
        customer.setDocumentNumber(request.getDocumentNumber());
        customer.setName(request.getName());
        customer.setSurname(request.getSurname());
        customer.setDateBirth(request.getDateBirth());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setStatus(request.getStatus());

        // Update location relationship
        if (request.getLocationId() != null) {
            Location location = locationRepository.findById(request.getLocationId()).orElse(null);
            customer.setLocation(location);
        }
    }
}