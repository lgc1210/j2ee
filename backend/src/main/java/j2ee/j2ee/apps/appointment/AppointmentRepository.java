package j2ee.j2ee.apps.appointment;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    public List<AppointmentEntity> findAllByCustomerId(long customerId);
}
