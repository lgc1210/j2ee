package j2ee.j2ee.apps.appointment;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import j2ee.j2ee.apps.payment.PaymentEntity;
import j2ee.j2ee.apps.payment.PaymentService;
import j2ee.j2ee.apps.service.ServiceEntity;
import j2ee.j2ee.apps.store.StoreEntity;
import j2ee.j2ee.apps.user.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<AppointmentEntity> create(@RequestBody Map<String, Object> payload) {
        try {
            String appointmentDateStr = (String) payload.get("appointment_date");
            String appointmentTimeStr = (String) payload.get("appointment_time");
            String status = (String) payload.get("status");

            Long customerId = null;
            Object customerIdObj = payload.get("customer_id");
            if (customerIdObj instanceof Integer) {
                customerId = ((Integer) customerIdObj).longValue();
            } else if (customerIdObj instanceof Long) {
                customerId = (Long) customerIdObj;
            }

            Long staffId = null;
            Object staffIdObj = payload.get("staff_id");
            if (staffIdObj instanceof Integer) {
                staffId = ((Integer) staffIdObj).longValue();
            } else if (staffIdObj instanceof Long) {
                staffId = (Long) staffIdObj;
            }

            Long serviceId = null;
            Object serviceIdObj = payload.get("service_id");
            if (serviceIdObj instanceof Integer) {
                serviceId = ((Integer) serviceIdObj).longValue();
            } else if (serviceIdObj instanceof Long) {
                serviceId = (Long) serviceIdObj;
            }

            Long storeId = null;
            Object storeIdObj = payload.get("store_id");
            if (storeIdObj instanceof Integer) {
                storeId = ((Integer) storeIdObj).longValue();
            } else if (storeIdObj instanceof Long) {
                storeId = (Long) storeIdObj;
            }

            // Validate required fields
            if (appointmentDateStr == null || appointmentTimeStr == null || customerId == null || staffId == null
                    || serviceId == null || storeId == null) {
                return ResponseEntity.badRequest().build();
            }

            // Create AppointmentEntity
            AppointmentEntity appointmentEntity = new AppointmentEntity();
            appointmentEntity.setAppointment_date(LocalDate.parse(appointmentDateStr));
            appointmentEntity.setAppointment_time(LocalTime.parse(appointmentTimeStr));
            appointmentEntity.setStatus(status != null ? status : "Pending");
            // Set related entities
            UserEntity customer = new UserEntity();
            customer.setId(customerId);
            appointmentEntity.setCustomer(customer);

            UserEntity staff = new UserEntity();
            staff.setId(staffId);
            appointmentEntity.setStaff(staff);

            ServiceEntity service = new ServiceEntity();
            service.setId(serviceId);
            appointmentEntity.setService(service);

            StoreEntity store = new StoreEntity();
            store.setId(storeId);
            appointmentEntity.setStore(store);

            Optional<AppointmentEntity> appointment = appointmentService.create(appointmentEntity);
            if (!appointment.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            AppointmentEntity createdAppointment = appointment.get();

            URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                    .buildAndExpand(createdAppointment.getId()).toUri();

            return ResponseEntity.created(location).body(createdAppointment);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/customer")
    public ResponseEntity<Object> getAllByCustomerId(@RequestParam Long customer_id,
            @RequestParam int page, @RequestParam int size) {
        try {
            System.out.println("Customer ID: " + customer_id);
            var pageAppointments = this.appointmentService.getAllByCustomerId(customer_id, page, size);
            if (pageAppointments.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            HashMap<String, Object> response = new HashMap<>();
            response.put("appointments", pageAppointments.getContent());
            response.put("currentPage", pageAppointments.getNumber());
            response.put("totalPages", pageAppointments.getTotalPages());
            response.put("totalElements", pageAppointments.getTotalElements());

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentEntity> getById(@PathVariable(value = "id") Long id) {
        try {
            var appointment = this.appointmentService.getById(id);
            if (!appointment.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok().body(appointment.get());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

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

    // ------------------day-time--------------------
    // lấy số lượng lịch hẹn theo ngày trong tuần
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

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<AppointmentEntity>> getByStoreId(@PathVariable Long storeId) {
        try {
            var appointmentList = this.appointmentService.getByStoreId(storeId);
            if (appointmentList.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(appointmentList);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    public String getMethodName(@RequestParam String param) {
        return new String();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentEntity> updateAppointmentStatus(
            @PathVariable("id") Long appointmentId,
            @RequestParam("status") String status,
            @RequestBody(required = false) PaymentEntity payment) {

        status = status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase();

        Optional<AppointmentEntity> updatedAppointment = appointmentService.updateStatus(appointmentId, status);

        AppointmentEntity appointment = updatedAppointment.orElse(null);

        if (payment != null && status.equals("Completed")) {
            payment.setAppointment(appointment);
            if (paymentService.createPayment(payment) == null) {
                System.err.println("Failed to create payment");
                return ResponseEntity.internalServerError().build();
            }
            ;
        }

        return updatedAppointment
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
