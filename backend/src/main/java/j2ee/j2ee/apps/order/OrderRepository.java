package j2ee.j2ee.apps.order;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    public List<OrderEntity> findAllByUserId(long userId);

}
