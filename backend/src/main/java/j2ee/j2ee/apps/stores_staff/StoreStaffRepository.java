package j2ee.j2ee.apps.staff;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface StaffRepository extends JpaRepository<StaffEntity, Long> {
   

        @Query("SELECT s FROM stores_staff s " +
           "JOIN s.store st " +
           "JOIN st.owner u " +
           "WHERE u.id = :userId")
    List<StaffEntity> findAllByStaffId(@Param("userId") Long userId);

    
}
