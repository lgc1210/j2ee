package j2ee.j2ee.apps.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    //all time 
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
}