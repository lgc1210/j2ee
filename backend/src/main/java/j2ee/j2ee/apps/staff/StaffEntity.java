package j2ee.j2ee.apps.staff;

import j2ee.j2ee.apps.service.ServiceEntity;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.store.StoreEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity(name = "stores_staff")
@Data
public class StaffEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "store_id", referencedColumnName = "id")
    private StoreEntity store;
    @ManyToOne
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    private ServiceEntity service;
    @ManyToOne
    @JoinColumn(name = "staff_id", referencedColumnName = "id")
    private UserEntity staff;
}
