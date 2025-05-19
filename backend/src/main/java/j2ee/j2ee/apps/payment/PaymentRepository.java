package j2ee.j2ee.apps.payment;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import j2ee.j2ee.apps.appointment.AppointmentEntity;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    Optional<PaymentEntity> findByAppointmentId(Long appointmentId);
}
