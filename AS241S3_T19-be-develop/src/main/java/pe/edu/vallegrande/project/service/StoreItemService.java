package pe.edu.vallegrande.project.service;

import pe.edu.vallegrande.project.dto.StoreItemDTO;
import pe.edu.vallegrande.project.dto.StoreItemRequest;
import pe.edu.vallegrande.project.dto.StoreSummaryDTO;
import java.util.List;
import java.util.Optional;

public interface StoreItemService {
    List<StoreItemDTO> findAll();
    Optional<StoreItemDTO> findById(Long id);
    Optional<StoreItemDTO> findByItemCode(String itemCode);
    List<StoreItemDTO> findByStatus(String status);
    List<StoreItemDTO> findByCategory(String category);
    List<StoreItemDTO> findBySupplier(Long supplierId);
    List<StoreItemDTO> findByLocation(String location);
    List<StoreItemDTO> searchItems(String search, String status);
    
    // Special queries
    List<StoreItemDTO> findLowStockItems();
    List<StoreItemDTO> findOutOfStockItems();
    List<StoreItemDTO> findNearExpiryItems();
    
    StoreItemDTO save(StoreItemRequest storeItemRequest);
    StoreItemDTO update(Long id, StoreItemRequest storeItemRequest);
    void delete(Long id);
    void restore(Long id);
    
    // Stock management
    StoreItemDTO updateStock(Long id, Integer newStock);
    StoreItemDTO addStock(Long id, Integer quantity);
    StoreItemDTO reduceStock(Long id, Integer quantity);
    
    StoreSummaryDTO getSummary();
    boolean existsByItemCode(String itemCode);
    boolean existsByProductName(String productName);
    String generateNextItemCode();
}