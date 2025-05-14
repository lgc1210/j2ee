package j2ee.j2ee.apps.user;

import java.util.List;
import java.util.Optional;

import j2ee.j2ee.apps.store.StoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByPhone(String phone);

    @Query("SELECT u FROM users u WHERE u.role.name = 'staff' AND " +
            "u.id IN (SELECT ss.staff_id FROM stores_staff ss WHERE ss.store_id = :store_id)")
    List<UserEntity> findStaffByStoreAndService(@Param("store_id") long store_id, @Param("service_id") long service_id);

    void deleteAllByIdIn(List<Long> ids);

    @Query(value = "SELECT * FROM users WHERE role_id = :roleId", nativeQuery = true)
    List<UserEntity> getListByRoleID(@Param("roleId") Long roleId);
}
