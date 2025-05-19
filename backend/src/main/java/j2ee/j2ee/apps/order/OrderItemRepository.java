// OrderItemRepository.java
package j2ee.j2ee.apps.order;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
