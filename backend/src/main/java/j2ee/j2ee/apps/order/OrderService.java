package j2ee.j2ee.apps.order;

import java.util.List;
import java.util.Optional;
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
        LocalDate startOfWeek = LocalDate.ofYearDay(year, 1)
                .with(weekFields.weekOfYear(), week)
                .with(weekFields.dayOfWeek(), 1);
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

    public OrderEntity createOrder(CreateOrderRequest request) {
        System.out.println("Requested storeId: " + request);
        var user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setStore(store);
        order.setCreated_at(LocalDateTime.now());
        order.setOrder_date(LocalDateTime.now());
        order.setShipping_address(request.getShippingAddress());
        order.setStatus("Waiting for approval");

        List<OrderItem> items = new ArrayList<>();
        double totalAmount = 0;

        for (OrderItemRequest itemRequest : request.getItems()) {
            var product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStock_quantity() < itemRequest.getQuantity() || !product.getIs_in_stock()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }

            if (!product.getIs_sale()) {
                throw new RuntimeException("The product is no longer available for sale: " + product.getName());
            }

            product.setStock_quantity(product.getStock_quantity() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(product.getPrice());

            totalAmount += item.getPrice() * item.getQuantity();
            items.add(item);
        }

        order.setTotal_amount(totalAmount);
        order.setItems(items);

        OrderEntity savedOrder = orderRepository.save(order);

        return savedOrder;
    }

    public OrderEntity updateOrderStatus(Long orderId, String newStatus) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
