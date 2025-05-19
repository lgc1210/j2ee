package j2ee.j2ee.apps.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RequestMapping("/api/orders")
@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Get orders pagination by user id
    @GetMapping("/users/{user_id}")
    public ResponseEntity<Object> getAllByUserId(@PathVariable("user_id") long userId, @RequestParam("page") int page,
            @RequestParam("size") int size) {
        try {
            Page<OrderEntity> pageOrders = this.orderService.getAllByUserId(userId, page, size);
            if (pageOrders.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            HashMap<String, Object> response = new HashMap<>();
            response.put("totalElements", pageOrders.getTotalElements());
            response.put("totalPages", pageOrders.getTotalPages());
            response.put("currentPage", pageOrders.getNumber());
            response.put("orders", pageOrders.getContent());

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            System.out.println("Internal Server Errors:" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get order details
    @GetMapping("/{order_id}")
    public ResponseEntity<OrderEntity> getByOrderId(@PathVariable("order_id") long orderId) {
        try {
            Optional<OrderEntity> pageOrders = this.orderService.getByOrderId(orderId);
            return pageOrders.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.out.println("Internal Server Errors:" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/filter_orders")
    public Map<String, Long> getOrderStats(
            @RequestParam("filter") String filter,
            @RequestParam(value = "specificFilter", required = false) String specificFilter) {
        return orderService.getOrderStatistics(filter, specificFilter);
    }

    @GetMapping
    public ResponseEntity<List<OrderEntity>> getAllOrders() {
        List<OrderEntity> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<OrderEntity>> getAllOrdersByStore(
            @PathVariable("storeId") Long storeId) {
        List<OrderEntity> orders = orderService.getAllOrdersOfStore(storeId);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<OrderEntity> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            var result = orderService.createOrder(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        try {
            OrderEntity updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
