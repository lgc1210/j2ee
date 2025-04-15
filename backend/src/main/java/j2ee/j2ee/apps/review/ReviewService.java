package j2ee.j2ee.apps.review;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Optional<List<ReviewEntity>> getAllByAppointmentId(long appointment_id) {
        List<ReviewEntity> appointmentList = this.reviewRepository.findAllByAppointmentId(appointment_id);
        return Optional.ofNullable(appointmentList);
    }

    public ReviewEntity create(ReviewEntity review) {
        return this.reviewRepository.save(review);
    }
}
