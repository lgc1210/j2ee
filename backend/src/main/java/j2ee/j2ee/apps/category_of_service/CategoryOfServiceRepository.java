package j2ee.j2ee.apps.category_of_service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryOfServiceRepository extends JpaRepository<CategoryOfServiceEntity, Long> {

}
