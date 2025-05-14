package j2ee.j2ee.apps.staff_availability;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {
    @Autowired
    private AvailabilityService availabilityService;

    // Endpoint to get available time slots for a date, service, and store
    @GetMapping("/time-slots")
    public List<TimeSlotDTO> getAvailableTimeSlots(
            @RequestParam("store_id") long store_id,
            @RequestParam("service_id") long service_id,
            @RequestParam("appointment_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate appointment_date
    ) {
        return availabilityService.getAvailableTimeSlotsForDate(service_id, store_id, appointment_date);
    }

    // Endpoint to get available staff for a specific time slot, date, service, and store
    @GetMapping("/staff")
    public List<StaffAvailabilityDTO> getAvailableStaff(
            @RequestParam("store_id") long store_id,
            @RequestParam("service_id") long service_id,
            @RequestParam("appointment_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate appointment_date,
            @RequestParam("start_time") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime start_time,
            @RequestParam("end_time") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime end_time
    ) {
        return availabilityService.getAvailableStaffForTimeSlot(service_id, store_id, appointment_date, start_time, end_time);
    }
}