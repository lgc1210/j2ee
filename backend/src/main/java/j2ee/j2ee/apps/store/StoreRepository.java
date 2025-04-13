package j2ee.j2ee.apps.store;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StoreRepository extends JpaRepository<StoreEntity, Long> {
    StoreEntity findById(long id);

    void deleteAllByIdIn(List<Long> ids);
}
