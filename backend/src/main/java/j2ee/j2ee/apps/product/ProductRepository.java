package j2ee.j2ee.apps.product;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import j2ee.j2ee.apps.store.StoreEntity;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
        List<ProductEntity> findAllByStoreId(long storeId);

        @Query("SELECT p FROM products p " +
                        "JOIN p.store s " +
                        "JOIN s.owner u " +
                        "WHERE u.id = :userId")
        List<ProductEntity> findAllByLoggedInUser(@Param("userId") long userId);

        @Query("FROM products p WHERE p.store.id = :store_id AND p.name LIKE CONCAT('%', :query, '%') and p.category.id = :category_id")
        List<ProductEntity> findWithConditions(
                        @Param(value = "store_id") long store_id,
                        @Param(value = "query") String query,
                        @Param(value = "category_id") String category_id);

}
