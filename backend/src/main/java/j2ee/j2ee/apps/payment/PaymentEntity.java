package j2ee.j2ee.apps.payment;

import j2ee.j2ee.apps.appointment.AppointmentEntity;
import j2ee.j2ee.apps.store.StoreEntity;
import j2ee.j2ee.apps.user.UserEntity;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
@Entity(name = "payments")
@Data

public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JoinColumn(name = "appointment_id", referencedColumnName = "id", nullable = false)
    private AppointmentEntity appointment;

    private String payment_method;

    private double price;

    private String status;

    private LocalDateTime payment_date;
}