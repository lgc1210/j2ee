package j2ee.j2ee.apps.category_of_service;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryOfServiceRepository extends JpaRepository<CategoryOfServiceEntity, Integer> {
    void deleteAllByIdIn(List<Integer> ids);
}