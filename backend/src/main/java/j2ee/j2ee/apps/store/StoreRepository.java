package j2ee.j2ee.apps.store;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StoreRepository extends JpaRepository<StoreEntity, Long> {
    @Query("FROM stores s ORDER BY s.name ASC")
    Page<StoreEntity> findAllPage(Pageable pageable);

    void deleteAllByIdIn(List<Long> ids);
}