package j2ee.j2ee.apps.appointment;

import java.time.LocalDate;
import java.util.List;

import j2ee.j2ee.apps.user.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    Page<AppointmentEntity> findAllByCustomerId(Long customerId, Pageable pageable);

    @Query("FROM appointments a WHERE a.staff = :staff AND a.appointment_date = :appointment_date")
    List<AppointmentEntity> findStaffAndAppointmentDate(
            @Param("staff") UserEntity staff,
            @Param("appointment_date") LocalDate appointment_date
    );
}
