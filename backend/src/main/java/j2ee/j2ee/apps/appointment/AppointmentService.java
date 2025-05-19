package j2ee.j2ee.apps.appointment;

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
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

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

    // Get appointment counts for all time filters
    public Map<String, Long> getAppointmentStatistics(String filter, String specificFilter) {
        Map<String, Long> stats = new HashMap<>();

        switch (filter.toLowerCase()) {
            case "all":
                stats.put("allTime", getAllTimeAppointments());
                break;
            case "weekly":
                if (specificFilter != null && !specificFilter.isEmpty()) {
                    stats.put("weekly", getWeeklyAppointments(specificFilter));
                }
                break;
            case "monthly":
                if (specificFilter != null && !specificFilter.isEmpty()) {
                    stats.put("monthly", getMonthlyAppointments(specificFilter));
                }
                break;
            case "yearly":
                if (specificFilter != null && !specificFilter.isEmpty()) {
                    stats.put("yearly", getYearlyAppointments(specificFilter));
                }
                break;
            default:
                throw new IllegalArgumentException("Invalid filter type: " + filter);
        }

        return stats;
    }

    // All time appointments
    private long getAllTimeAppointments() {
        return appointmentRepository.count();
    }

    // Weekly appointments
    private long getWeeklyAppointments(String weekString) {
        String[] parts = weekString.split("-W");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid week format. Expected: YYYY-Www");
        }

        int year = Integer.parseInt(parts[0]);
        int week = Integer.parseInt(parts[1]);

        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        LocalDate startOfWeek = LocalDate.ofYearDay(year, 1)
                .with(weekFields.weekOfYear(), week)
                .with(weekFields.dayOfWeek(), 1); // Start on Monday
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        return appointmentRepository.countByWeek(startOfWeek, endOfWeek);
    }

    // Monthly appointments
    private long getMonthlyAppointments(String monthString) {
        String[] parts = monthString.replace("Tháng ", "").split("/");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid month format. Expected: Tháng M/YYYY");
        }

        int month = Integer.parseInt(parts[0]);
        int year = Integer.parseInt(parts[1]);

        return appointmentRepository.countByMonth(year, month);
    }

    // Yearly appointments
    private long getYearlyAppointments(String yearString) {
        int year = Integer.parseInt(yearString);
        return appointmentRepository.countByYear(year);
    }

    public Map<String, List<Map<String, Object>>> getServiceCategoryStats(String timeFilter, String specificFilter) {
        List<Object[]> result;
        Map<String, List<Map<String, Object>>> response = new HashMap<>();

        switch (timeFilter) {
            case "all":
                result = appointmentRepository.findMostBookedCategoriesAllTime();
                break;
            case "weekly":
                String[] weekParts = specificFilter.split("-W");
                int year = Integer.parseInt(weekParts[0]);
                int week = Integer.parseInt(weekParts[1]);
                LocalDate startOfYear = LocalDate.of(year, 1, 1);
                LocalDate startDate = startOfYear.with(WeekFields.of(Locale.getDefault()).weekOfYear(), week)
                        .with(WeekFields.of(Locale.getDefault()).dayOfWeek(), 1);
                LocalDate endDate = startDate.plusDays(6);
                result = appointmentRepository.findMostBookedCategoriesByWeek(startDate, endDate);
                break;
            case "monthly":
                String[] monthParts = specificFilter.replace("Tháng ", "").split("/");
                int month = Integer.parseInt(monthParts[0]);
                int monthYear = Integer.parseInt(monthParts[1]);
                result = appointmentRepository.findMostBookedCategoriesByMonth(monthYear, month);
                break;
            case "yearly":
                int yearFilter = Integer.parseInt(specificFilter);
                result = appointmentRepository.findMostBookedCategoriesByYear(yearFilter);
                break;
            default:
                throw new IllegalArgumentException("Invalid time filter");
        }

        List<Map<String, Object>> categories = result.stream().map(row -> {
            Map<String, Object> category = new HashMap<>();
            category.put("id", row[0]);
            category.put("name", row[1]);
            category.put("appointmentCount", row[2]);
            return category;
        }).collect(Collectors.toList());

        int size = categories.size();
        response.put("mostBooked", categories.subList(0, Math.min(3, size)));
        response.put("leastBooked", size > 3 ? categories.subList(Math.max(size - 3, 3), size) : List.of());

        return response;
    }

    public static class StoreAppointmentStats {
        private StoreEntity highestStore;
        private Long highestCount;
        private StoreEntity lowestStore;
        private Long lowestCount;

        public StoreAppointmentStats(StoreEntity highestStore, Long highestCount,
                StoreEntity lowestStore, Long lowestCount) {
            this.highestStore = highestStore;
            this.highestCount = highestCount;
            this.lowestStore = lowestStore;
            this.lowestCount = lowestCount;
        }

        public StoreEntity getHighestStore() {
            return highestStore;
        }

        public Long getHighestCount() {
            return highestCount;
        }

        public StoreEntity getLowestStore() {
            return lowestStore;
        }

        public Long getLowestCount() {
            return lowestCount;
        }
    }

    // ------------------------day-time-----------

    private LocalDate[] getWeekRange(int year, int week) {
        LocalDate date = LocalDate.of(year, 1, 1)
                .with(WeekFields.ISO.weekOfYear(), week);
        LocalDate startOfWeek = date.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = date.with(DayOfWeek.SUNDAY);
        return new LocalDate[] { startOfWeek, endOfWeek };
    }

    public Map<String, Integer> getBusiestDays(int year, int week) {
        LocalDate[] weekRange = getWeekRange(year, week);
        LocalDate startDate = weekRange[0];
        LocalDate endDate = weekRange[1];

        List<AppointmentEntity> appointments = appointmentRepository.findAppointmentsByWeek(startDate, endDate);

        Map<String, Integer> busiestDays = new HashMap<>();
        busiestDays.put("Monday", 0);
        busiestDays.put("Tuesday", 0);
        busiestDays.put("Wednesday", 0);
        busiestDays.put("Thursday", 0);
        busiestDays.put("Friday", 0);
        busiestDays.put("Saturday", 0);
        busiestDays.put("Sunday", 0);

        appointments.forEach(appointment -> {
            String dayName = appointment.getAppointment_date().getDayOfWeek().toString();
            String formattedDayName = dayName.substring(0, 1).toUpperCase() + dayName.substring(1).toLowerCase();
            busiestDays.put(formattedDayName, busiestDays.get(formattedDayName) + 1);
        });

        return busiestDays;
    }

    public Map<String, Integer> getPopularTimeSlots(int year, int week) {
        LocalDate[] weekRange = getWeekRange(year, week);
        LocalDate startDate = weekRange[0];
        LocalDate endDate = weekRange[1];

        List<AppointmentEntity> appointments = appointmentRepository.findAppointmentsByWeek(startDate, endDate);

        Map<String, Integer> timeSlots = new HashMap<>();
        for (int hour = 7; hour <= 21; hour++) {
            String slot = String.format("%02d:00-%02d:00", hour, hour + 1);
            timeSlots.put(slot, 0);
        }

        appointments.forEach(appointment -> {
            LocalTime time = appointment.getAppointment_time();
            if (time != null) {
                int hour = time.getHour();
                if (hour >= 7 && hour < 22) {
                    String slot = String.format("%02d:00-%02d:00", hour, hour + 1);
                    timeSlots.put(slot, timeSlots.getOrDefault(slot, 0) + 1);
                }
            }
        });

        return timeSlots;
    }

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

    public List<AppointmentEntity> getByStoreId(long storeId) {
        return this.appointmentRepository.findByStore_Id(storeId);
    }

    public Optional<AppointmentEntity> updateStatus(Long appointmentId, String newStatus) {
        Optional<AppointmentEntity> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isPresent()) {
            AppointmentEntity appointment = appointmentOpt.get();
            appointment.setStatus(newStatus);
            appointmentRepository.save(appointment);
            return Optional.of(appointment);
        }
        return Optional.empty();
    }
}
