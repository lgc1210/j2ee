package j2ee.j2ee.apps.appointment;

import java.util.Optional;

import j2ee.j2ee.apps.service.ServiceEntity;
import j2ee.j2ee.apps.service.ServiceRepository;
import j2ee.j2ee.apps.store.StoreEntity;
import j2ee.j2ee.apps.store.StoreRepository;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private StoreRepository storeRepository;

    @Transactional
    public Optional<AppointmentEntity> create(AppointmentEntity appointment) {
        if (appointment.getAppointment_date() == null ||
                appointment.getAppointment_time() == null ||
                appointment.getCustomer().getId() == null ||
                appointment.getStaff().getId() == null ||
                appointment.getService().getId() == null ||
                appointment.getStore().getId() == null) {
            return Optional.empty();
        }

        AppointmentEntity appointmentEntity = new AppointmentEntity();

        appointmentEntity.setAppointment_date(appointment.getAppointment_date());
        appointmentEntity.setAppointment_time(appointment.getAppointment_time());
        appointmentEntity.setStatus(appointment.getStatus());

        // Customer
        Optional<UserEntity> customerOptional = userRepository.findById(appointment.getCustomer().getId());
        if (!customerOptional.isPresent()) {
            return Optional.empty();
        }
        appointmentEntity.setCustomer(customerOptional.get());

        // Service
        Optional<ServiceEntity> serviceOptional = serviceRepository.findById(appointment.getService().getId());
        if (!serviceOptional.isPresent()) {
            return Optional.empty();
        }
        appointmentEntity.setService(serviceOptional.get());

        // Store
        Optional<StoreEntity> storeOptional = storeRepository.findById(appointment.getStore().getId());
        if (!storeOptional.isPresent()) {
            return Optional.empty();
        }
        appointmentEntity.setStore(storeOptional.get());

        // Staff
        Optional<UserEntity> staffOptional = userRepository.findById(appointment.getStaff().getId());
        if (!staffOptional.isPresent()) {
            return Optional.empty();
        }
        appointmentEntity.setStaff(staffOptional.get());

        // Save appointment into database
        AppointmentEntity savedAppointment = appointmentRepository.save(appointment);

        return Optional.of(savedAppointment);
    }

    public Page<AppointmentEntity> getAllByCustomerId(long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return this.appointmentRepository.findAllByCustomerId(customerId, pageable);
    }

    public Optional<AppointmentEntity> getById(long appointmentId) {
        return this.appointmentRepository.findById(appointmentId);
    }
}
