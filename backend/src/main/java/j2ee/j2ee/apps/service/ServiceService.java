package j2ee.j2ee.apps.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ServiceService {
    @Autowired
    private ServiceRepository serviceRepository;

    public Page<ServiceEntity> getByStoreId(int storeId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
        return serviceRepository.findAllByStoreId(storeId, pageable);
    }
}
