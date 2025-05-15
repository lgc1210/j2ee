package j2ee.j2ee.apps.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
// Removed conflicting import for Authentication
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import j2ee.j2ee.apps.category.CategoryEntity;
import j2ee.j2ee.apps.category_of_service.CategoryOfServiceEntity;
import j2ee.j2ee.apps.category_of_service.CategoryOfServiceRepository;
import j2ee.j2ee.apps.product.ProductEntity;
import j2ee.j2ee.apps.store.StoreEntity;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserRepository;
import j2ee.j2ee.apps.store.StoreRepository;
import java.util.List;
@Service
public class ServiceService {
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private CategoryOfServiceRepository CategoryOfServiceRepository;
    public Page<ServiceEntity> getByStoreId(int storeId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
        return serviceRepository.findAllByStoreId(storeId, pageable);
    }

    public List<ServiceEntity> getAllServicesByUserId(long userId) {
        return serviceRepository.findAllByOwnerId(userId);
    }

    public ServiceEntity createService(ServiceEntity serviceEntity,Authentication authentication) {
        // Lấy thông tin username từ Authentication
        String username = authentication.getPrincipal().toString();
        System.out.println("Logged-in username: " + username);

        // Tìm UserEntity dựa trên email (username)
        UserEntity user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tìm StoreEntity dựa trên owner_id (userId)
        StoreEntity store = storeRepository.findStoreByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Store not found for the logged-in user"));

        

        // Gán StoreEntity và CategoryEntity vào ProductEntity
        serviceEntity.setStore(store);
        return serviceRepository.save(serviceEntity);
    }

        public ServiceEntity updateService(Long serviceId, ServiceEntity serviceEntity) {
        Optional<ServiceEntity> existingService = serviceRepository.findById(serviceId);
        CategoryOfServiceEntity CategoryService = CategoryOfServiceRepository.findById(serviceEntity.getCategory_of_service().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        if (existingService.isPresent()) {
            ServiceEntity serviceToUpdate = existingService.get();
            serviceToUpdate.setName(serviceEntity.getName());
            serviceToUpdate.setDescription(serviceEntity.getDescription());
            serviceToUpdate.setPrice(serviceEntity.getPrice());
            serviceToUpdate.setDuration(serviceEntity.getDuration());
            serviceToUpdate.setStatus(serviceEntity.getStatus());
            serviceToUpdate.setCategory_of_service(CategoryService);
            return serviceRepository.save(serviceToUpdate);
        }
        return null;
    }

    public Optional<ServiceEntity> getById(long id) {
        return this.serviceRepository.findById(id);
    }

    public void deleteService(long serviceId) {
        serviceRepository.deleteById(serviceId);
    }

    public void deleteMultipleServices(List<Long> serviceIds) {
        serviceRepository.deleteAllById(serviceIds);
    }
}
