package j2ee.j2ee.apps.service;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    public Optional<ServiceEntity> getByStoreId(int storeId);
}
