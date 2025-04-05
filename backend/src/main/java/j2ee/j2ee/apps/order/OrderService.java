package j2ee.j2ee.apps.order;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Optional<List<OrderEntity>> getAllByUserId(long userId) {
        List<OrderEntity> orderList = this.orderRepository.findAllByUserId(userId);
        return Optional.ofNullable(orderList);
    }

    public Optional<OrderEntity> getByOrderId(long orderId) {
        return this.orderRepository.findById(orderId);
    }
}
