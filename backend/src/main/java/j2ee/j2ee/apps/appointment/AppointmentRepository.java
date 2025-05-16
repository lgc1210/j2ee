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
        List<AppointmentEntity> findByStore_Id(Long storeId);

        Page<AppointmentEntity> findAllByCustomerId(Long customerId, Pageable pageable);

        // All time count
        long count();

        // Weekly count
        @Query("SELECT COUNT(a) FROM appointments a WHERE a.appointment_date BETWEEN :startDate AND :endDate")
        long countByWeek(LocalDate startDate, LocalDate endDate);

        // Monthly count
        @Query("SELECT COUNT(a) FROM appointments a WHERE YEAR(a.appointment_date) = :year AND MONTH(a.appointment_date) = :month")
        long countByMonth(int year, int month);

        // Yearly count
        @Query("SELECT COUNT(a) FROM appointments a WHERE YEAR(a.appointment_date) = :year")
        long countByYear(int year);

        // -------------------Service booked ------------------

        // All Time
        @Query("SELECT s.category_of_service.id, s.category_of_service.name, COUNT(a) as count " +
                        "FROM appointments a JOIN services s ON a.service.id = s.id " +
                        "GROUP BY s.category_of_service.id, s.category_of_service.name " +
                        "ORDER BY count DESC")
        List<Object[]> findMostBookedCategoriesAllTime();

        // Weekly
        @Query("SELECT s.category_of_service.id, s.category_of_service.name, COUNT(a) as count " +
                        "FROM appointments a JOIN services s ON a.service.id = s.id " +
                        "WHERE a.appointment_date BETWEEN :startDate AND :endDate " +
                        "GROUP BY s.category_of_service.id, s.category_of_service.name " +
                        "ORDER BY count DESC")
        List<Object[]> findMostBookedCategoriesByWeek(LocalDate startDate, LocalDate endDate);

        // Monthly
        @Query("SELECT s.category_of_service.id, s.category_of_service.name, COUNT(a) as count " +
                        "FROM appointments a JOIN services s ON a.service.id = s.id " +
                        "WHERE YEAR(a.appointment_date) = :year AND MONTH(a.appointment_date) = :month " +
                        "GROUP BY s.category_of_service.id, s.category_of_service.name " +
                        "ORDER BY count DESC")
        List<Object[]> findMostBookedCategoriesByMonth(int year, int month);

        // Yearly
        @Query("SELECT s.category_of_service.id, s.category_of_service.name, COUNT(a) as count " +
                        "FROM appointments a JOIN services s ON a.service.id = s.id " +
                        "WHERE YEAR(a.appointment_date) = :year " +
                        "GROUP BY s.category_of_service.id, s.category_of_service.name " +
                        "ORDER BY count DESC")
        List<Object[]> findMostBookedCategoriesByYear(int year);

        // -------------------------time--day-------------------

        @Query("SELECT a FROM appointments a WHERE a.appointment_date BETWEEN :startDate AND :endDate")
        List<AppointmentEntity> findAppointmentsByWeek(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("FROM appointments a WHERE a.staff = :staff AND a.appointment_date = :appointment_date")
        List<AppointmentEntity> findStaffAndAppointmentDate(
                        @Param("staff") UserEntity staff,
                        @Param("appointment_date") LocalDate appointment_date);
}
