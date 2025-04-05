package j2ee.j2ee.apps.appointment;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Optional<List<AppointmentEntity>> getAllByUserId(long userId) {
        List<AppointmentEntity> appointmentList =
                this.appointmentRepository.findAllByUserId(userId);
        return Optional.ofNullable(appointmentList);
    }

    public Optional<AppointmentEntity> getByOrderId(long appointmentId) {
        return this.appointmentRepository.findById(appointmentId);
    }
}
