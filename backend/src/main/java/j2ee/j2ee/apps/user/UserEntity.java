package j2ee.j2ee.apps.user;

import java.time.LocalDate;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import j2ee.j2ee.apps.role.RoleEntity;
import lombok.Data;

@Entity(name = "users")
@Data
@EntityListeners(AuditingEntityListener.class)
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String phone;

    private String password;

    @Column(unique = true)
    private String status;

    @CreatedDate
    @Column(updatable = false)
    private LocalDate created_at;

    @LastModifiedDate
    private LocalDate updated_at;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id", nullable = false)
    private RoleEntity role;
}
