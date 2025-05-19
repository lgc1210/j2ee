package j2ee.j2ee.apps.order;

import java.util.List;
import java.util.Optional;

import j2ee.j2ee.apps.cart.CartEntity;
import j2ee.j2ee.apps.cart.CartRepository;
import j2ee.j2ee.apps.product.ProductEntity;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import j2ee.j2ee.apps.product.ProductRepository;
import j2ee.j2ee.apps.store.StoreRepository;
import j2ee.j2ee.apps.user.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CartRepository cartRepository;

    public Page<OrderEntity> getAllByUserId(long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "created_at"));
        return this.orderRepository.findAllByUserId(userId, pageable);
    }

    public Optional<OrderEntity> getByOrderId(long orderId) {
        return this.orderRepository.findById(orderId);
    }

    // all time
    public Map<String, Long> getOrderStatistics(String filter, String specificFilter) {
        Map<String, Long> stats = new HashMap<>();

        switch (filter.toLowerCase()) {
            case "all":
                stats.put("allTime", getAllTimeOrders());
                break;
            case "weekly":
                if (specificFilter != null && !specificFilter.isEmpty()) {
                    stats.put("weekly", getWeeklyOrders(specificFilter));
                }
                break;
            case "monthly":
                if (specificFilter != null && !specificFilter.isEmpty()) {
                    stats.put("monthly", getMonthlyOrders(specificFilter));
                }
                break;
            case "yearly":
                if (specificFilter != null && !specificFilter.isEmpty()) {
                    stats.put("yearly", getYearlyOrders(specificFilter));
                }
                break;
            default:
                throw new IllegalArgumentException("Invalid filter type: " + filter);
        }

        return stats;
    }

    // All time orders
    private long getAllTimeOrders() {
        return orderRepository.count();
    }

    // Weekly orders
    private long getWeeklyOrders(String weekString) {
        String[] parts = weekString.split("-W");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid week format. Expected: YYYY-Www");
        }

        int year = Integer.parseInt(parts[0]);
        int week = Integer.parseInt(parts[1]);

        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        LocalDate startOfWeek = LocalDate.ofYearDay(year, 1).with(weekFields.weekOfYear(), week).with(weekFields.dayOfWeek(), 1);
        LocalDateTime startDateTime = startOfWeek.atStartOfDay();
        LocalDateTime endDateTime = startOfWeek.plusDays(6).atTime(23, 59, 59);

        return orderRepository.countByWeek(startDateTime, endDateTime);
    }

    // Monthly orders
    private long getMonthlyOrders(String monthString) {
        String[] parts = monthString.replace("Tháng ", "").split("/");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid month format. Expected: Tháng M/YYYY");
        }

        int month = Integer.parseInt(parts[0]);
        int year = Integer.parseInt(parts[1]);

        return orderRepository.countByMonth(year, month);
    }

    // Yearly orders
    private long getYearlyOrders(String yearString) {
        int year = Integer.parseInt(yearString);
        return orderRepository.countByYear(year);
    }

    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<OrderEntity> getAllOrdersOfStore(Long storeId) {
        return orderRepository.findAllByStoreId(storeId);
    }

    @Transactional
    public OrderEntity createOrder(CreateOrderRequest request) {
        var user = userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

        OrderEntity order = new OrderEntity();
        order.setStatus("Pending");
        order.setTotal_amount(request.getTotalAmount());
        order.setUser(user);
        order.setName(request.getName());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setShipping_address(request.getShippingAddress());
        order.setPayment_method(request.getPaymentMethod());
        order.setNote(request.getNote());
        order.setStore(null);

        OrderEntity createdOrder = orderRepository.save(order);

        List<OrderItem> items = new ArrayList<>();
        request.getItems().forEach((item) -> {
            Optional<ProductEntity> optionalProduct = productRepository.findById(item.getProductId());
            if (optionalProduct.isEmpty()) {
                return;
            }
            ProductEntity product = optionalProduct.get();
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setOrder(createdOrder);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(product.getPrice());

            OrderItem savedItem = orderItemRepository.save(orderItem);

            items.add(savedItem);
        });

        order.setItems(items);

        Optional<CartEntity> optionalCart = cartRepository.findByUserId(user.getId());
        if (!optionalCart.isEmpty()) cartRepository.delete(optionalCart.get());

        return createdOrder;
    }

    public OrderEntity updateOrderStatus(Long orderId, String newStatus) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
