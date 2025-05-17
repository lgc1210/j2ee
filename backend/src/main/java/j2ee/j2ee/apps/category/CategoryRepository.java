package j2ee.j2ee.apps.category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import j2ee.j2ee.apps.product.ProductEntity;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    
        @Query("SELECT c FROM categories c " +
                        "JOIN c.store s " +
                        "JOIN s.owner u " +
                        "WHERE u.id = :userId")
        List<CategoryEntity> findAllByLoggedInUser(@Param("userId") long userId);
}
