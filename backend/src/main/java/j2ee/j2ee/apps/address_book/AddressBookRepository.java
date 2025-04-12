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

    @Query("FROM address_book a WHERE a.user.id = :userId AND a.is_default = true")
    Optional<AddressBookEntity> findByUserIdAndIsDefault(@Param("userId") long userId);

    @Query("SELECT EXISTS (SELECT 1 FROM address_book a WHERE a.address = :address AND a.name = :name AND a.phone = :phone)")
    Boolean checkDuplicatedAddress(@Param("address") String address, @Param("phone") String phone,
            @Param("name") String name);

    @Modifying
    @Query("UPDATE address_book a SET a.is_default = false WHERE a.user.id = :userId AND a.is_default = true")
    void clearDefaultForUser(@Param("userId") long userId);
}
