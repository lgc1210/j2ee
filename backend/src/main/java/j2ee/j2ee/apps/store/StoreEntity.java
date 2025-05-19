package j2ee.j2ee.apps.store;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Base64;

import com.fasterxml.jackson.annotation.JsonIgnore;
import j2ee.j2ee.apps.user.UserEntity;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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

    @Transient // Not stored in database
    private String imageBase64;

    // Getter to convert byte[] to Base64
    public String getImageBase64() {
        if (image != null)
            return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(image);
        return null;
    }

    @ManyToOne(cascade = CascadeType.REMOVE)
    @OneToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private UserEntity owner;
}
