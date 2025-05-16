package j2ee.j2ee.apps.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    Page<ServiceEntity> findAllByStoreId(long storeId, Pageable pageable);

    public Page<ServiceEntity> findAllByStoreId(int storeId, Pageable pageable);

    @Query("SELECT s FROM services s " +
            "JOIN s.store st " +
            "JOIN st.owner u " +
            "WHERE u.id = :userId")
    List<ServiceEntity> findAllByOwnerId(@Param("userId") Long userId);

}
