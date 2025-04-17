package j2ee.j2ee.apps.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    public Page<ServiceEntity> findAllByStoreId(int storeId, Pageable pageable);
}
