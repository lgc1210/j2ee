package j2ee.j2ee.apps.store;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

@Repository
public interface StoreRepository extends JpaRepository<StoreEntity, Long> {
    @Query("FROM stores s ORDER BY s.name ASC")
    Page<StoreEntity> findAllPage(Pageable pageable);

    Optional<StoreEntity> findById(long id);

    @Query("FROM stores s JOIN services se ON s.id = se.store.id WHERE se.category_of_service.id = :category_of_service_id")
    List<StoreEntity> filterByCategoryOfServiceId(@Param("category_of_service_id") Long category_of_service_id);

    @Query("SELECT s FROM stores s WHERE s.owner.id = :userId")
    Optional<StoreEntity> findStoreByUserId(@Param("userId") Long userId);

    void deleteAllByIdIn(List<Long> ids);
}