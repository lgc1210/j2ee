package j2ee.j2ee.apps.cart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {

    public CartEntity findByUserId(long user_id);
}
