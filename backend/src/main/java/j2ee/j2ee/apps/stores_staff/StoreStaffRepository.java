package j2ee.j2ee.apps.stores_staff;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface StoreStaffRepository extends JpaRepository<StoreStaffEntity, Long> {

}
