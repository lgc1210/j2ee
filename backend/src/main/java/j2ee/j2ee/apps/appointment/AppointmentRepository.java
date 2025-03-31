package j2ee.j2ee.apps.appointment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {

}
