package j2ee.j2ee.apps.statistics;


import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@PermitAll()
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/stores/appointments")
    public ResponseEntity<Map<String, List<StoreStatsDTO>>> getStoreAppointmentStats(
            @RequestParam String timeFilter,
            @RequestParam(required = false) String specificFilter) {
        return ResponseEntity.ok(statisticsService.getStoreAppointmentStats(timeFilter, specificFilter));
    }

    @GetMapping("/stores/revenue")
    public ResponseEntity<Map<String, List<StoreStatsDTO>>> getStoreRevenueStats(
            @RequestParam String timeFilter,
            @RequestParam(required = false) String specificFilter) {
        return ResponseEntity.ok(statisticsService.getStoreRevenueStats(timeFilter, specificFilter));
    }

    @GetMapping("/customers/appointments")
    public ResponseEntity<Map<String, List<UserStatsDTO>>> getCustomerAppointmentStats(
            @RequestParam String timeFilter,
            @RequestParam(required = false) String specificFilter) {
        return ResponseEntity.ok(statisticsService.getCustomerAppointmentStats(timeFilter, specificFilter));
    }

    @GetMapping("/staff/appointments")
    public ResponseEntity<Map<String, List<UserStatsDTO>>> getStaffAppointmentStats(
            @RequestParam String timeFilter,
            @RequestParam(required = false) String specificFilter) {
        return ResponseEntity.ok(statisticsService.getStaffAppointmentStats(timeFilter, specificFilter));
    }
}