package j2ee.j2ee.apps.staff_availability;

import j2ee.j2ee.apps.appointment.AppointmentEntity;
import j2ee.j2ee.apps.appointment.AppointmentRepository;
import j2ee.j2ee.apps.service.ServiceEntity;
import j2ee.j2ee.apps.service.ServiceRepository;
import j2ee.j2ee.apps.store.StoreEntity;
import j2ee.j2ee.apps.store.StoreRepository;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AvailabilityService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;

    // Step 1: Get available time slots for a date, service, and store
    public List<TimeSlotDTO> getAvailableTimeSlotsForDate(long service_id, long store_id, LocalDate appointment_date) {
        Optional<ServiceEntity> serviceOptional = serviceRepository.findById(service_id);
        Optional<StoreEntity> storeOptional = storeRepository.findById(store_id);

        if (!serviceOptional.isPresent() || !storeOptional.isPresent()) {
            return new ArrayList<>();
        }

        ServiceEntity service = serviceOptional.get();
        StoreEntity store = storeOptional.get();

        // Get all staff for the store and service
        List<UserEntity> staffList = userRepository.findStaffByStoreAndService(store.getId(), service.getId());

        if (staffList.isEmpty()) {
            return new ArrayList<>();
        }

        // Generate all possible time slots
        int serviceDurationMinutes = service.getDuration();
        LocalTime openTime = store.getOpen_time();
        LocalTime closeTime = store.getClose_time();

        if (openTime == null || closeTime == null) {
            return new ArrayList<>();
        }

        List<TimeSlotDTO> allTimeSlots = generateTimeSlots(openTime, closeTime, serviceDurationMinutes);
        List<TimeSlotDTO> availableTimeSlots = new ArrayList<>();

        // Check each time slot: it's available if at least one staff member is free
        for (TimeSlotDTO slot : allTimeSlots) {
            boolean isSlotAvailable = false;
            for (UserEntity staff : staffList) {
                List<AppointmentEntity> staffAppointments = appointmentRepository.findStaffAndAppointmentDate(staff,
                        appointment_date);
                System.out.println("Staff appointments: " + staffAppointments);
                if (isTimeSlotAvailableForStaff(slot, staffAppointments)) {
                    isSlotAvailable = true;
                    break; // At least one staff is available, so the slot is available
                }
            }
            if (isSlotAvailable) {
                availableTimeSlots.add(slot);
            }
        }

        return availableTimeSlots;
    }

    // Step 2: Get available staff for a specific time slot, date, service, and
    // store
    public List<StaffAvailabilityDTO> getAvailableStaffForTimeSlot(long service_id, long store_id,
            LocalDate appointment_date, LocalTime appointment_start_time, LocalTime appointment_end_time) {
        Optional<ServiceEntity> serviceOptional = serviceRepository.findById(service_id);
        Optional<StoreEntity> storeOptional = storeRepository.findById(store_id);

        if (!serviceOptional.isPresent() || !storeOptional.isPresent()) {
            return new ArrayList<>();
        }

        ServiceEntity service = serviceOptional.get();
        StoreEntity store = storeOptional.get();

        List<UserEntity> staffList = userRepository.findStaffByStoreAndService(store.getId(), service.getId());

        if (staffList.isEmpty()) {
            return new ArrayList<>();
        }

        List<StaffAvailabilityDTO> availableStaff = new ArrayList<>();

        for (UserEntity staff : staffList) {
            List<AppointmentEntity> staffAppointments = appointmentRepository.findStaffAndAppointmentDate(staff,
                    appointment_date);

            TimeSlotDTO selectedSlot = new TimeSlotDTO(appointment_start_time, appointment_end_time);
            if (isTimeSlotAvailableForStaff(selectedSlot, staffAppointments)) {
                availableStaff.add(new StaffAvailabilityDTO(staff));
            }
        }

        return availableStaff;
    }

    private List<TimeSlotDTO> generateTimeSlots(LocalTime openTime, LocalTime closeTime, int intervalMinutes) {
        List<TimeSlotDTO> timeSlots = new ArrayList<>();
        LocalTime currentTime = openTime;

        while (!currentTime.isAfter(closeTime)) {
            LocalTime slotEndTime = currentTime.plusMinutes(intervalMinutes);
            if (slotEndTime.isAfter(closeTime.plusMinutes(1))) {
                break;
            }
            timeSlots.add(new TimeSlotDTO(currentTime, slotEndTime));
            currentTime = slotEndTime;
        }

        return timeSlots;
    }

    private boolean isTimeSlotAvailableForStaff(TimeSlotDTO slot, List<AppointmentEntity> appointments) {
        LocalTime slotStartTime = slot.getStartTime();
        LocalTime slotEndTime = slot.getEndTime();

        for (AppointmentEntity appointment : appointments) {
            LocalTime appointmentStart = appointment.getAppointment_time();
            LocalTime appointmentEnd = appointmentStart.plusMinutes(appointment.getService().getDuration());

            if (slotEndTime.isAfter(appointmentStart) && slotStartTime.isBefore(appointmentEnd)) {
                return false; // Staff is booked during this time slot
            }
        }

        return true; // Staff is available
    }
}