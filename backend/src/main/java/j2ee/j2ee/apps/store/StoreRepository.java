package j2ee.j2ee.apps.store;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<StoreEntity, Long> {
    Optional<StoreEntity> findById(Long id);

    void deleteAllByIdIn(List<Long> ids);
}
