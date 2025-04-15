package j2ee.j2ee.apps.review;

import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import j2ee.j2ee.apps.appointment.AppointmentEntity;
import j2ee.j2ee.apps.user.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity(name = "reviews")
@EntityListeners(AuditingEntityListener.class)
public class ReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private int rating;

    private String comment;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime created_at;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "appointment_id", referencedColumnName = "id", nullable = false)
    private AppointmentEntity appointment;
}
