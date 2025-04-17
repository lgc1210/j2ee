package j2ee.j2ee.apps.appointment;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Page<AppointmentEntity> getAllByCustomerId(long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
        return this.appointmentRepository.findAllByCustomerId(customerId, pageable);
    }

    public Optional<AppointmentEntity> getById(long appointmentId) {
        return this.appointmentRepository.findById(appointmentId);
    }
}
