package j2ee.j2ee.apps.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/filter_orders")
    public Map<String, Long> getOrderStats(
            @RequestParam("filter") String filter,
            @RequestParam(value = "specificFilter", required = false) String specificFilter) {
        return orderService.getOrderStatistics(filter, specificFilter);
    }
}