package j2ee.j2ee.apps.category;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    @Query(value = "SELECT * FROM categories WHERE store_id = :storeId", nativeQuery = true)
    List<CategoryEntity> findByStoreId(@Param("storeId") Long storeId);
}
