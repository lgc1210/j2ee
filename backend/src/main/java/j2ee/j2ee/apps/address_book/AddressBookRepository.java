package j2ee.j2ee.apps.address_book;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressBookRepository extends JpaRepository<AddressBookEntity, Long> {
    List<AddressBookEntity> findAllByUserId(long userId);

    AddressBookEntity findByUserId(long userId);

    Optional<AddressBookEntity> findByUserIdAndIsDefautTrue(long userId);

    @Modifying
    @Query("UPDATE address_book a SET a.isDefault = false WHERE a.user.id = :userId AND a.isDefault = true")
    void clearDefaultForUser(@Param("userId") long userId);
}
