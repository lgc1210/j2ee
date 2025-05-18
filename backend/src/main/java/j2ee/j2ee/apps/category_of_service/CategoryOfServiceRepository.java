package j2ee.j2ee.apps.category_of_service;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface CategoryOfServiceRepository extends JpaRepository<CategoryOfServiceEntity, Long> {
    void deleteAllByIdIn(List<Long> ids);
}
