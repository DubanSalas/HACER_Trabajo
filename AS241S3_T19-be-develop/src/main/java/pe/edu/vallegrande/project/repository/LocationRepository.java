package pe.edu.vallegrande.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pe.edu.vallegrande.project.model.Location;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

    Optional<Location> findByDepartmentAndProvinceAndDistrict(String department, String province, String district);

    List<Location> findByDepartment(String department);
    List<Location> findByProvince(String province);
    List<Location> findByDistrict(String district);

    @Query("SELECT DISTINCT l.department FROM Location l ORDER BY l.department")
    List<String> findAllDepartments();

    @Query("SELECT DISTINCT l.province FROM Location l WHERE l.department = :department ORDER BY l.province")
    List<String> findProvincesByDepartment(@Param("department") String department);

    @Query("SELECT DISTINCT l.district FROM Location l WHERE l.department = :department AND l.province = :province ORDER BY l.district")
    List<String> findDistrictsByDepartmentAndProvince(@Param("department") String department, @Param("province") String province);
}
