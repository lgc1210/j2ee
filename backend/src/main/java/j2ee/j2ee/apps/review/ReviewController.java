package j2ee.j2ee.apps.review;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/appointments/{appointment_id}")
    public ResponseEntity<List<ReviewEntity>> getAllByAppointmentId(
            @PathVariable(value = "appointment_id") long appointment_id) {
        try {
            var appointmentList = this.reviewService.getAllByAppointmentId(appointment_id);
            if (!appointmentList.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok().body(appointmentList.get());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping()
    public ResponseEntity<ReviewEntity> create(
            @RequestBody ReviewEntity payload) {
        try {
            var createdReview = this.reviewService.create(payload);

            return ResponseEntity.ok().body(createdReview);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

}
