package j2ee.j2ee.apps.discount;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import j2ee.j2ee.apps.product.ProductEntity;

import java.util.List;

public interface DiscountRepository extends JpaRepository<DiscountEntity, Long> {
    
        @Query("SELECT d FROM DiscountEntity d " +
                        "JOIN d.store s " +
                        "JOIN s.owner u " +
                        "WHERE u.id = :userId")
        List<DiscountEntity> findAllByLoggedInUser(@Param("userId") long userId);
}
    
