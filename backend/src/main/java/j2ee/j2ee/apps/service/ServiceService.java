package j2ee.j2ee.apps.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServiceService {
    @Autowired
    private ServiceRepository serviceRepository;

    public Optional<ServiceEntity> getByStoreId(int storeId) {
        return serviceRepository.getByStoreId(storeId);
    }
}
