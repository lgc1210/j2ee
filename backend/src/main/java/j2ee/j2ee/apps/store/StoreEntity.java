package j2ee.j2ee.apps.store;

import java.time.LocalDateTime;
import java.time.LocalTime;

import j2ee.j2ee.apps.user.UserEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity(name = "stores")
@Data
public class StoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;

    private String description;

    private String address;

    private String phone;

    private String image;

    private LocalDateTime created_at;

    private LocalDateTime updated_at;

    private LocalTime open_time;

    private LocalTime close_time;

    private String status;

    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private UserEntity owner;
}
