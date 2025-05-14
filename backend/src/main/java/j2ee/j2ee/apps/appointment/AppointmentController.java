package j2ee.j2ee.apps.appointment;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import j2ee.j2ee.apps.service.ServiceEntity;
import j2ee.j2ee.apps.store.StoreEntity;
import j2ee.j2ee.apps.user.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

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
            if (appointmentDateStr == null || appointmentTimeStr == null || customerId == null || staffId == null || serviceId == null || storeId == null) {
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

            URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(createdAppointment.getId()).toUri();

            return ResponseEntity.created(location).body(createdAppointment);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/customer")
    public ResponseEntity<Object> getAllByCustomerId(@RequestParam("customer_id") Long customer_id, @RequestParam("page") int page, @RequestParam("size") int size) {
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
}
