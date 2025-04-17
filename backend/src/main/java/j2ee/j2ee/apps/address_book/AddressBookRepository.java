package j2ee.j2ee.apps.address_book;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;

@Repository
public interface AddressBookRepository extends JpaRepository<AddressBookEntity, Long> {
    @Query("FROM address_book a WHERE a.user.id = :userId ORDER BY a.is_default DESC, a.id ASC")
    Page<AddressBookEntity> findAllByUserId(long userId, Pageable pageable);

    List<AddressBookEntity> findAllByUserId(long userId);

    AddressBookEntity findByUserId(long userId);

    @Query("FROM address_book a WHERE a.user.id = :userId AND a.is_default = true")
    Optional<AddressBookEntity> findByUserIdAndIsDefault(@Param("userId") long userId);

    @Modifying
    @Transactional
    @Query("UPDATE address_book a SET a.is_default = false WHERE a.user.id = :userId")
    void clearDefaultForUser(@Param("userId") long userId);
}
