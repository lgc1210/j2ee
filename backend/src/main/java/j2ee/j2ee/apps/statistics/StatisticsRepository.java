package j2ee.j2ee.apps.statistics;

import j2ee.j2ee.apps.store.StoreEntity;
import j2ee.j2ee.apps.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface StatisticsRepository extends JpaRepository<StoreEntity, Long> {

    @Query("SELECT a.store, COUNT(a) as count FROM appointments a " +
            "WHERE (:start IS NULL OR a.appointment_date >= :start) AND (:end IS NULL OR a.appointment_date <= :end) " +
            "GROUP BY a.store ORDER BY count DESC")
    List<Object[]> findStoreAppointmentStats(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT a.store, COUNT(a) as count FROM appointments a " +
            "WHERE (:start IS NULL OR a.appointment_date >= :start) AND (:end IS NULL OR a.appointment_date <= :end) " +
            "GROUP BY a.store ORDER BY count ASC")
    List<Object[]> findStoreAppointmentStatsAsc(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT s, COALESCE(SUM(o.total_amount), 0) + COALESCE(SUM(p.price), 0) as revenue " +
            "FROM stores s LEFT JOIN orders o ON o.store = s " +
            "LEFT JOIN appointments a ON a.store = s " +
            "LEFT JOIN payments p ON p.appointment = a " +
            "WHERE (:start IS NULL OR COALESCE(o.order_date, p.payment_date) >= :start) AND (:end IS NULL OR COALESCE(o.order_date, p.payment_date) <= :end) " +
            "GROUP BY s ORDER BY revenue DESC")
    List<Object[]> findStoreRevenueStats(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT s, COALESCE(SUM(o.total_amount), 0) + COALESCE(SUM(p.price), 0) as revenue " +
            "FROM stores s LEFT JOIN orders o ON o.store = s " +
            "LEFT JOIN appointments a ON a.store = s " +
            "LEFT JOIN payments p ON p.appointment = a " +
            "WHERE (:start IS NULL OR COALESCE(o.order_date, p.payment_date) >= :start) AND (:end IS NULL OR COALESCE(o.order_date, p.payment_date) <= :end) " +
            "GROUP BY s ORDER BY revenue ASC")
    List<Object[]> findStoreRevenueStatsAsc(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT a.customer, COUNT(a) as count FROM appointments a " +
            "WHERE a.customer.role.id = 2 AND (:start IS NULL OR a.appointment_date >= :start) AND (:end IS NULL OR a.appointment_date <= :end) " +
            "GROUP BY a.customer ORDER BY count DESC")
    List<Object[]> findCustomerAppointmentStats(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT a.customer, COUNT(a) as count FROM appointments a " +
            "WHERE a.customer.role.id = 2 AND (:start IS NULL OR a.appointment_date >= :start) AND (:end IS NULL OR a.appointment_date <= :end) " +
            "GROUP BY a.customer ORDER BY count ASC")
    List<Object[]> findCustomerAppointmentStatsAsc(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT a.staff, COUNT(a) as count FROM appointments a " +
            "WHERE a.staff.role.id = 4 AND a.staff IS NOT NULL AND (:start IS NULL OR a.appointment_date >= :start) AND (:end IS NULL OR a.appointment_date <= :end) " +
            "GROUP BY a.staff ORDER BY count DESC")
    List<Object[]> findStaffAppointmentStats(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT a.staff, COUNT(a) as count FROM appointments a " +
            "WHERE a.staff.role.id = 4 AND a.staff IS NOT NULL AND (:start IS NULL OR a.appointment_date >= :start) AND (:end IS NULL OR a.appointment_date <= :end) " +
            "GROUP BY a.staff ORDER BY count ASC")
    List<Object[]> findStaffAppointmentStatsAsc(@Param("start") LocalDate start, @Param("end") LocalDate end);
}