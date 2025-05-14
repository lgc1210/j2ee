package j2ee.j2ee.apps.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Page<OrderEntity> findAllByUserId(long userId, Pageable pageable);

    // All time count
    long count();

    // Weekly count
    @Query("SELECT COUNT(o) FROM orders o WHERE o.created_at BETWEEN :startDate AND :endDate")
    long countByWeek(LocalDateTime startDate, LocalDateTime endDate);

    // Monthly count
    @Query("SELECT COUNT(o) FROM orders o WHERE YEAR(o.created_at) = :year AND MONTH(o.created_at) = :month")
    long countByMonth(int year, int month);

    // Yearly count
    @Query("SELECT COUNT(o) FROM orders o WHERE YEAR(o.created_at) = :year")
    long countByYear(int year);
}