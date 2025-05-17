package j2ee.j2ee.apps.staff;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
// Removed conflicting import for Authentication

import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import j2ee.j2ee.apps.category_of_service.CategoryOfServiceRepository;
import j2ee.j2ee.apps.store.StoreEntity;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserRepository;
import j2ee.j2ee.apps.user.UserService;
import j2ee.j2ee.apps.store.StoreRepository;

import java.time.LocalDate;
import java.util.List;
@Service
public class StaffService {
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private UserService userService;
   

    public List<StaffEntity> getAllStaffByUserId(long userId) {
        return staffRepository.findAllByStaffId(userId);
    }

    public StaffEntity createStaff(StaffEntity staffEntity) {
    return staffRepository.save(staffEntity);
}

        public StaffEntity updateStaff(Long staffId, StaffEntity staffEntity) {
        Optional<StaffEntity> existingStaffOpt = staffRepository.findById(staffId);
        if (existingStaffOpt.isPresent()) {
            StaffEntity existingStaff = existingStaffOpt.get();
    
            // Cập nhật tên, dịch vụ, trạng thái
            existingStaff.setService(staffEntity.getService());
            existingStaff.setStatus(staffEntity.getStatus());
    
            // Cập nhật thông tin user (name, phone)
            UserEntity user = existingStaff.getStaff();
            if (user != null && staffEntity.getStaff() != null) {
                user.setName(staffEntity.getStaff().getName());
                user.setPhone(staffEntity.getStaff().getPhone());
                userRepository.save(user);
            }
    
            return staffRepository.save(existingStaff);
        } else {
            throw new RuntimeException("Staff not found");
        }
    }

    public Optional<StaffEntity> getById(long id) {
        return this.staffRepository.findById(id);
    }

    

    public boolean deleteStaff(long staffId) {
        Optional<StaffEntity> staffOpt = staffRepository.findById(staffId);
        if (staffOpt.isPresent()) {
            StaffEntity staff = staffOpt.get();
            UserEntity user = staff.getStaff();
            if (user != null) {
                user.setDelete_at(LocalDate.now());
                userRepository.save(user);
            }
            staffRepository.deleteById(staffId);
            return true;
        }
        return false;
    }

    public boolean deleteMultipleStaff(List<Long> staffIds) {
    List<StaffEntity> staffs = staffRepository.findAllById(staffIds);
    if (staffs.isEmpty()) return false;
    for (StaffEntity staff : staffs) {
        UserEntity user = staff.getStaff();
        if (user != null) {
            user.setDelete_at(LocalDate.now());
            userRepository.save(user);
        }
    }
    staffRepository.deleteAllById(staffIds);
    return true;
}
}
