package j2ee.j2ee.apps.appointment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/filter_appointments")
    public Map<String, Long> getAppointmentStats(
            @RequestParam("filter") String filter,
            @RequestParam(value = "specificFilter", required = false) String specificFilter) {
        return appointmentService.getAppointmentStatistics(filter, specificFilter);
    }

    @GetMapping("/service-category-stats")
    public Map<String, List<Map<String, Object>>> getServiceCategoryStats(
            @RequestParam("timeFilter") String timeFilter,
            @RequestParam(value = "specificFilter", defaultValue = "") String specificFilter) {
        return appointmentService.getServiceCategoryStats(timeFilter, specificFilter);
    }

    //------------------day-time--------------------
    //lấy số lượng lịch hẹn theo ngày trong tuần
    @GetMapping("/busiest-days")
    public ResponseEntity<Map<String, Integer>> getBusiestDays(
            @RequestParam("year") int year,
            @RequestParam("week") int week) {
        Map<String, Integer> busiestDays = appointmentService.getBusiestDays(year, week);
        return ResponseEntity.ok(busiestDays);
    }



    // Endpoint lấy số lượng lịch hẹn theo khung giờ trong tuần
    @GetMapping("/popular-time-slots")
    public ResponseEntity<Map<String, Integer>> getPopularTimeSlots(
            @RequestParam("year") int year,
            @RequestParam("week") int week) {
        Map<String, Integer> timeSlots = appointmentService.getPopularTimeSlots(year, week);
        return ResponseEntity.ok(timeSlots);
    }


}