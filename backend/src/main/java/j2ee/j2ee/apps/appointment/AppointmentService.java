package j2ee.j2ee.apps.appointment;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Optional<List<AppointmentEntity>> getAllByCustomerId(long customerId) {
        List<AppointmentEntity> appointmentList = this.appointmentRepository.findAllByCustomerId(customerId);
        return Optional.ofNullable(appointmentList);
    }

    public Optional<AppointmentEntity> getById(long appointmentId) {
        return this.appointmentRepository.findById(appointmentId);
    }
}
