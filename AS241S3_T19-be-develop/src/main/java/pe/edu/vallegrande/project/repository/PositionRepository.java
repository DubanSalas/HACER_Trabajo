package pe.edu.vallegrande.project.repository;

import pe.edu.vallegrande.project.model.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByStatus(String status);
    List<Position> findByStatusNot(String status);
    
    Optional<Position> findByPositionName(String positionName);
    List<Position> findByPositionNameContainingIgnoreCase(String positionName);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.position.idPosition = :positionId")
    Long countEmployeesByPosition(@Param("positionId") Long positionId);
}