package j2ee.j2ee.apps.stores_staff;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity(name = "stores_staff")
@Data
public class StoreStaffEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private long store_id;

    private long staff_id;

    private long service_id;

    private String status;
}
