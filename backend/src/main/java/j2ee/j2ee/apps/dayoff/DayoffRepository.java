package j2ee.j2ee.apps.dayoff;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DayoffRepository extends JpaRepository<DayoffEntity, Long> {
    @Query("SELECT d FROM DayoffEntity d " +
           "JOIN d.store s " +
           "JOIN s.owner u " +
           "WHERE u.id = :userId")
    List<DayoffEntity> findAllByLoggedInUser(@Param("userId") long userId);
}