package j2ee.j2ee.apps.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import j2ee.j2ee.apps.appointment.AppointmentEntity;
import j2ee.j2ee.apps.user.UserDTO;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor

public class PaymentDTO {
    private Long id;
    private AppointmentEntity appointment;
    private String paymentMethod;
    private double price;
    private LocalDateTime paymentDate;
    private UserDTO staff;
}
