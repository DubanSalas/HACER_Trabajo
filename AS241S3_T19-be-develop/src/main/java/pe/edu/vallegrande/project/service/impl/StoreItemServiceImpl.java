package pe.edu.vallegrande.project.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.vallegrande.project.model.StoreItem;
import pe.edu.vallegrande.project.model.Supplier;
import pe.edu.vallegrande.project.repository.StoreItemRepository;
import pe.edu.vallegrande.project.repository.SupplierRepository;
import pe.edu.vallegrande.project.service.StoreItemService;
import pe.edu.vallegrande.project.dto.StoreItemDTO;
import pe.edu.vallegrande.project.dto.StoreItemRequest;
import pe.edu.vallegrande.project.dto.StoreSummaryDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StoreItemServiceImpl implements StoreItemService {

    private final StoreItemRepository storeItemRepository;
    private final SupplierRepository supplierRepository;

    @Autowired
    public StoreItemServiceImpl(StoreItemRepository storeItemRepository,
                               SupplierRepository supplierRepository) {
        this.storeItemRepository = storeItemRepository;
        this.supplierRepository = supplierRepository;
    }

    @Override
    public List<StoreItemDTO> findAll() {
        return storeItemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<StoreItemDTO> findById(Long id) {
        return storeItemRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public Optional<StoreItemDTO> findByItemCode(String itemCode) {
        return storeItemRepository.findByItemCode(itemCode)
                .map(this::convertToDTO);
    }

    @Override
    public List<StoreItemDTO> findByStatus(String status) {
        return storeItemRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StoreItemDTO> findByCategory(String category) {
        return storeItemRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StoreItemDTO> findBySupplier(Long supplierId) {
        return storeItemRepository.findBySupplierIdSupplier(supplierId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StoreItemDTO> findByLocation(String location) {
        return storeItemRepository.findByLocationContainingIgnoreCase(location).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StoreItemDTO> searchItems(String search, String status) {
        return storeItemRepository.findBySearchAndStatus(search, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StoreItemDTO> findLowStockItems() {
        return storeItemRepository.findLowStockItems().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StoreItemDTO> findOutOfStockItems() {
        return storeItemRepository.findOutOfStockItems().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StoreItemDTO> findNearExpiryItems() {
        LocalDate sevenDaysFromNow = LocalDate.now().plusDays(7);
        return storeItemRepository.findNearExpiryItems(sevenDaysFromNow).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StoreItemDTO save(StoreItemRequest storeItemRequest) {
        StoreItem storeItem = convertToEntity(storeItemRequest);
        
        // Generate item code if not provided
        if (storeItem.getItemCode() == null || storeItem.getItemCode().isEmpty()) {
            storeItem.setItemCode(generateNextItemCode());
        }
        
        StoreItem savedItem = storeItemRepository.save(storeItem);
        return convertToDTO(savedItem);
    }

    @Override
    @Transactional
    public StoreItemDTO update(Long id, StoreItemRequest storeItemRequest) {
        Optional<StoreItem> existing = storeItemRepository.findById(id);
        if (existing.isPresent()) {
            StoreItem storeItem = existing.get();
            updateItemFromRequest(storeItem, storeItemRequest);
            StoreItem updatedItem = storeItemRepository.save(storeItem);
            return convertToDTO(updatedItem);
        }
        return null;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Optional<StoreItem> existing = storeItemRepository.findById(id);
        existing.ifPresent(item -> {
            item.setStatus("Inactivo");
            storeItemRepository.save(item);
        });
    }

    @Override
    @Transactional
    public void restore(Long id) {
        Optional<StoreItem> existing = storeItemRepository.findById(id);
        existing.ifPresent(item -> {
            item.updateStatus(); // This will set the appropriate status based on stock and expiry
            storeItemRepository.save(item);
        });
    }

    @Override
    @Transactional
    public StoreItemDTO updateStock(Long id, Integer newStock) {
        Optional<StoreItem> existing = storeItemRepository.findById(id);
        if (existing.isPresent()) {
            StoreItem item = existing.get();
            item.setCurrentStock(newStock);
            item.updateStatus();
            StoreItem updatedItem = storeItemRepository.save(item);
            return convertToDTO(updatedItem);
        }
        return null;
    }

    @Override
    @Transactional
    public StoreItemDTO addStock(Long id, Integer quantity) {
        Optional<StoreItem> existing = storeItemRepository.findById(id);
        if (existing.isPresent()) {
            StoreItem item = existing.get();
            item.setCurrentStock(item.getCurrentStock() + quantity);
            item.updateStatus();
            StoreItem updatedItem = storeItemRepository.save(item);
            return convertToDTO(updatedItem);
        }
        return null;
    }

    @Override
    @Transactional
    public StoreItemDTO reduceStock(Long id, Integer quantity) {
        Optional<StoreItem> existing = storeItemRepository.findById(id);
        if (existing.isPresent()) {
            StoreItem item = existing.get();
            int newStock = Math.max(0, item.getCurrentStock() - quantity);
            item.setCurrentStock(newStock);
            item.updateStatus();
            StoreItem updatedItem = storeItemRepository.save(item);
            return convertToDTO(updatedItem);
        }
        return null;
    }

    @Override
    public StoreSummaryDTO getSummary() {
        Long total = storeItemRepository.count();
        Long lowStock = storeItemRepository.countLowStock();
        Long outOfStock = storeItemRepository.countOutOfStock();
        Long nearExpiry = storeItemRepository.countNearExpiry(LocalDate.now().plusDays(7));
        var totalValue = storeItemRepository.getTotalInventoryValue();
        
        return new StoreSummaryDTO(total, lowStock, outOfStock, nearExpiry,
                                 totalValue != null ? totalValue : java.math.BigDecimal.ZERO);
    }

    @Override
    public boolean existsByItemCode(String itemCode) {
        return storeItemRepository.existsByItemCode(itemCode);
    }

    @Override
    public boolean existsByProductName(String productName) {
        return storeItemRepository.existsByProductNameIgnoreCase(productName);
    }

    @Override
    public String generateNextItemCode() {
        // Generate a simple item code like A001, A002, etc.
        long count = storeItemRepository.count();
        return String.format("A%03d", count + 1);
    }

    private StoreItemDTO convertToDTO(StoreItem item) {
        StoreItemDTO dto = new StoreItemDTO();
        dto.setIdStoreItem(item.getIdStoreItem());
        dto.setItemCode(item.getItemCode());
        dto.setProductName(item.getProductName());
        dto.setCategory(item.getCategory());
        dto.setCurrentStock(item.getCurrentStock());
        dto.setMinimumStock(item.getMinimumStock());
        dto.setUnit(item.getUnit());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setExpiryDate(item.getExpiryDate());
        dto.setLocation(item.getLocation());
        dto.setStatus(item.getStatus());
        dto.setTotalStockValue(item.getTotalStockValue());
        dto.setNearExpiry(item.isNearExpiry());
        dto.setOutOfStock(item.isOutOfStock());
        dto.setLowStock(item.isLowStock());

        if (item.getSupplier() != null) {
            dto.setSupplierId(item.getSupplier().getIdSupplier());
            dto.setSupplierName(item.getSupplier().getCompanyName());
        }

        return dto;
    }

    private StoreItem convertToEntity(StoreItemRequest request) {
        StoreItem item = new StoreItem();
        item.setItemCode(request.getItemCode());
        item.setProductName(request.getProductName());
        item.setCategory(request.getCategory());
        item.setCurrentStock(request.getCurrentStock());
        item.setMinimumStock(request.getMinimumStock());
        item.setUnit(request.getUnit());
        item.setUnitPrice(request.getUnitPrice());
        item.setExpiryDate(request.getExpiryDate());
        item.setLocation(request.getLocation());
        item.setStatus(request.getStatus());

        // Set supplier relationship
        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId()).orElse(null);
            item.setSupplier(supplier);
        }

        return item;
    }

    private void updateItemFromRequest(StoreItem item, StoreItemRequest request) {
        item.setItemCode(request.getItemCode());
        item.setProductName(request.getProductName());
        item.setCategory(request.getCategory());
        item.setCurrentStock(request.getCurrentStock());
        item.setMinimumStock(request.getMinimumStock());
        item.setUnit(request.getUnit());
        item.setUnitPrice(request.getUnitPrice());
        item.setExpiryDate(request.getExpiryDate());
        item.setLocation(request.getLocation());
        item.setStatus(request.getStatus());

        // Update supplier relationship
        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId()).orElse(null);
            item.setSupplier(supplier);
        }
    }
}