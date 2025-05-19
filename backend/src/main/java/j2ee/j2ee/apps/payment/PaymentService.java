package j2ee.j2ee.apps.payment;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import j2ee.j2ee.apps.user.UserDTO;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserService;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private UserService userService;

    public PaymentDTO toPaymentDTO(PaymentEntity payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAppointment(payment.getAppointment());
        dto.setPaymentMethod(payment.getPayment_method());
        dto.setPrice(payment.getPrice());
        dto.setPaymentDate(payment.getPayment_date());
        dto.setStaff(userService.toUserDTO(payment.getStaff()));

        return dto;
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::toPaymentDTO)
                .toList();
    }

    public Optional<PaymentDTO> getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .map(this::toPaymentDTO);
    }

    public PaymentDTO createPayment(PaymentEntity payment) {
        Optional<PaymentEntity> existingPayment = paymentRepository
                .findByAppointmentId(payment.getAppointment().getId());

        if (existingPayment.isPresent()) {
            return toPaymentDTO(existingPayment.get());
        }

        return toPaymentDTO(paymentRepository.save(payment));
    }

    public List<PaymentEntity> getPaymentsByStoreId(Long storeId) {
        return paymentRepository.findByStoreId(storeId);
    }
}
