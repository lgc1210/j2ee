package j2ee.j2ee.apps.payment;

import j2ee.j2ee.apps.appointment.AppointmentEntity;
import j2ee.j2ee.apps.user.UserEntity;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity(name = "payments")
@Data
@EntityListeners(AuditingEntityListener.class)
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String payment_method;

    private double price;

    private String status;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime payment_date;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private UserEntity staff;

    @OneToOne
    @JoinColumn(name = "appointment_id", referencedColumnName = "id", nullable = false, unique = true)
    private AppointmentEntity appointment;
}