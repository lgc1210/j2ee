package j2ee.j2ee.apps.store;

import com.fasterxml.jackson.annotation.JsonIgnore;
import j2ee.j2ee.apps.user.UserEntity;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Base64;

@Entity(name = "stores")
@Data
@EntityListeners(AuditingEntityListener.class)
public class StoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String description;

    private String address;

    private String phone;

    private LocalDateTime created_at;

    private LocalDateTime updated_at;

    private LocalTime open_time;

    private LocalTime close_time;

    private String status;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] image;

    @Transient
    private String imageBase64;

    public String getImageBase64() {
        if (image != null) return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(image);
        return null;
    }

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private UserEntity owner;
}