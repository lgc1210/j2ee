package j2ee.j2ee.apps.payment;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import j2ee.j2ee.apps.appointment.AppointmentEntity;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    Optional<PaymentEntity> findByAppointmentId(Long appointmentId);

    @Query("SELECT p FROM payments p WHERE p.appointment.store.id = :storeId")
    List<PaymentEntity> findByStoreId(@Param("storeId") Long storeId);
}
