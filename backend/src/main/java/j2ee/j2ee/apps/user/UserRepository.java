package j2ee.j2ee.apps.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    List<UserEntity> findByIdIn(List<Long> ids);
    Optional<UserEntity> findByPhone(String phone);
    void deleteAllByIdIn(List<Long> ids);
    @Query(value = "SELECT * FROM users WHERE role_id = :roleId", nativeQuery = true)
    List<UserEntity> getListByRoleID(@Param("roleId") Long roleId);
}
