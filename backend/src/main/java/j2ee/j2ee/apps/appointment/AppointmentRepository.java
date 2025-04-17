package j2ee.j2ee.apps.appointment;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    public Page<AppointmentEntity> findAllByCustomerId(long customerId, Pageable pageable);
}
