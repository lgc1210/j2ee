package j2ee.j2ee.apps.appointment;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/users/{customer_id}")
    public ResponseEntity<List<AppointmentEntity>> getAllByCustomerId(
            @PathVariable(value = "customer_id") long customer_id) {
        try {
            var appointmentList = this.appointmentService.getAllByCustomerId(customer_id);
            if (!appointmentList.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok().body(appointmentList.get());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentEntity> getById(@PathVariable(value = "id") long id) {
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

    // @GetMapping("/available_times/stores/")
    // public String getMethodName(@RequestParam String param) {
    // return new String();
    // }

    // @GetMapping("/available_dates/stores/{store_id}")
    // public ResponseEntity<List<AppointmentEntity>> getAllAvailableDatesByStoreId(
    // @PathVariable(value = "store_id") long store_id) {

    // }

}
