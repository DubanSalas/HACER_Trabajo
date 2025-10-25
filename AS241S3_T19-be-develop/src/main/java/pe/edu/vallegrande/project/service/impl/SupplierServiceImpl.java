package pe.edu.vallegrande.project.service.impl;

import pe.edu.vallegrande.project.model.Supplier;
import pe.edu.vallegrande.project.model.Location;
import pe.edu.vallegrande.project.repository.SupplierRepository;
import pe.edu.vallegrande.project.repository.LocationRepository;
import pe.edu.vallegrande.project.service.SupplierService;
import pe.edu.vallegrande.project.dto.SupplierDTO;
import pe.edu.vallegrande.project.dto.SupplierRequest;
import pe.edu.vallegrande.project.dto.SupplierSummaryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final LocationRepository locationRepository;

    @Autowired
    public SupplierServiceImpl(SupplierRepository supplierRepository,
                              LocationRepository locationRepository) {
        this.supplierRepository = supplierRepository;
        this.locationRepository = locationRepository;
    }

    @Override
    public List<SupplierDTO> findAll() {
        return supplierRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<SupplierDTO> findById(Long id) {
        return supplierRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<SupplierDTO> findByStatus(String status) {
        return supplierRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SupplierDTO> findByCategory(String category) {
        return supplierRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SupplierDTO> findByPaymentTerms(String paymentTerms) {
        return supplierRepository.findByPaymentTerms(paymentTerms).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SupplierDTO> findByLocation(Long locationId) {
        return supplierRepository.findByLocationIdLocation(locationId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SupplierDTO> searchSuppliers(String search, String status) {
        return supplierRepository.findBySearchAndStatus(search, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierDTO save(SupplierRequest supplierRequest) {
        Supplier supplier = convertToEntity(supplierRequest);
        supplier.setStatus("A");
        Supplier savedSupplier = supplierRepository.save(supplier);
        return convertToDTO(savedSupplier);
    }

    @Override
    public SupplierDTO update(Long id, SupplierRequest supplierRequest) {
        Optional<Supplier> existing = supplierRepository.findById(id);
        if (existing.isPresent()) {
            Supplier supplier = existing.get();
            updateSupplierFromRequest(supplier, supplierRequest);
            Supplier updatedSupplier = supplierRepository.save(supplier);
            return convertToDTO(updatedSupplier);
        }
        return null;
    }

    @Override
    public void delete(Long id) {
        Optional<Supplier> existing = supplierRepository.findById(id);
        existing.ifPresent(s -> {
            s.setStatus("I");
            supplierRepository.save(s);
        });
    }

    @Override
    public void restore(Long id) {
        Optional<Supplier> existing = supplierRepository.findById(id);
        existing.ifPresent(s -> {
            s.setStatus("A");
            supplierRepository.save(s);
        });
    }

    @Override
    public void suspend(Long id) {
        Optional<Supplier> existing = supplierRepository.findById(id);
        existing.ifPresent(s -> {
            s.setStatus("S");
            supplierRepository.save(s);
        });
    }

    @Override
    public SupplierSummaryDTO getSummary() {
        Long total = supplierRepository.count();
        Long active = supplierRepository.countByStatus("A");
        Long inactive = supplierRepository.countByStatus("I");
        Long suspended = supplierRepository.countByStatus("S");
        
        return new SupplierSummaryDTO(total, active, inactive, suspended);
    }

    @Override
    public boolean existsByEmail(String email) {
        return supplierRepository.findByEmail(email).isPresent();
    }

    private SupplierDTO convertToDTO(Supplier supplier) {
        SupplierDTO dto = new SupplierDTO();
        dto.setIdSupplier(supplier.getIdSupplier());
        dto.setCompanyName(supplier.getCompanyName());
        dto.setContactName(supplier.getContactName());
        dto.setPhone(supplier.getPhone());
        dto.setEmail(supplier.getEmail());
        dto.setAddress(supplier.getAddress());
        dto.setCategory(supplier.getCategory());
        dto.setPaymentTerms(supplier.getPaymentTerms());
        dto.setStatus(supplier.getStatus());

        if (supplier.getLocation() != null) {
            dto.setLocationId(supplier.getLocation().getIdLocation());
            dto.setDepartment(supplier.getLocation().getDepartment());
            dto.setProvince(supplier.getLocation().getProvince());
            dto.setDistrict(supplier.getLocation().getDistrict());
            dto.setLocationAddress(supplier.getLocation().getAddress());
        }

        return dto;
    }

    private Supplier convertToEntity(SupplierRequest request) {
        Supplier supplier = new Supplier();
        supplier.setCompanyName(request.getCompanyName());
        supplier.setContactName(request.getContactName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        supplier.setCategory(request.getCategory());
        supplier.setPaymentTerms(request.getPaymentTerms());
        supplier.setStatus(request.getStatus());

        // Set location relationship
        if (request.getLocationId() != null) {
            Location location = locationRepository.findById(request.getLocationId()).orElse(null);
            supplier.setLocation(location);
        }

        return supplier;
    }

    private void updateSupplierFromRequest(Supplier supplier, SupplierRequest request) {
        supplier.setCompanyName(request.getCompanyName());
        supplier.setContactName(request.getContactName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        supplier.setCategory(request.getCategory());
        supplier.setPaymentTerms(request.getPaymentTerms());
        supplier.setStatus(request.getStatus());

        // Update location relationship
        if (request.getLocationId() != null) {
            Location location = locationRepository.findById(request.getLocationId()).orElse(null);
            supplier.setLocation(location);
        }
    }
}
