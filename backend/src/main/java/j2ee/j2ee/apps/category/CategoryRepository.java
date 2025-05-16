package j2ee.j2ee.apps.category;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    @Query("SELECT c FROM categories c WHERE c.deleted_at IS NULL")
    List<CategoryEntity> findActiveCategories();
}
