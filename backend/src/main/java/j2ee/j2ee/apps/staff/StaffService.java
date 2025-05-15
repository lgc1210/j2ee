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
import j2ee.j2ee.apps.store.StoreRepository;
import java.util.List;
@Service
public class StaffService {
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StoreRepository storeRepository;
   
   

    public List<StaffEntity> getAllStaffByUserId(long userId) {
        return staffRepository.findAllByStaffId(userId);
    }

    public StaffEntity createStaff(StaffEntity serviceEntity,Authentication authentication) {
        
        String username = authentication.getPrincipal().toString();
        System.out.println("Logged-in username: " + username);

        
        UserEntity user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        
        StoreEntity store = storeRepository.findStoreByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Store not found for the logged-in user"));

        

       
        serviceEntity.setStore(store);
        return staffRepository.save(serviceEntity);
    }

    //     public StaffEntity updateService(Long serviceId, StaffEntity serviceEntity) {
    //     Optional<StaffEntity> existingService = staffRepository.findById(serviceId);
    //     CategoryOfServiceEntity CategoryService = CategoryOfServiceRepository.findById(serviceEntity.getCategory_of_service().getId())
    //             .orElseThrow(() -> new RuntimeException("Category not found"));
    //     if (existingService.isPresent()) {
    //         ServiceEntity serviceToUpdate = existingService.get();
    //         serviceToUpdate.setName(serviceEntity.getName());
    //         serviceToUpdate.setDescription(serviceEntity.getDescription());
    //         serviceToUpdate.setPrice(serviceEntity.getPrice());
    //         serviceToUpdate.setDuration(serviceEntity.getDuration());
    //         serviceToUpdate.setStatus(serviceEntity.getStatus());
    //         serviceToUpdate.setCategory_of_service(CategoryService);
    //         return serviceRepository.save(serviceToUpdate);
    //     }
    //     return null;
    // }

    public Optional<StaffEntity> getById(long id) {
        return this.staffRepository.findById(id);
    }

    public void deleteStaff(long staffId) {
        staffRepository.deleteById(staffId);
    }

    public void deleteMultipleStaff(List<Long> staffIds) {
        staffRepository.deleteAllById(staffIds);
    }
}
