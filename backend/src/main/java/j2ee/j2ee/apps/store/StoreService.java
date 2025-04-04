package j2ee.j2ee.apps.store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service
public class StoreService {

    @Autowired
    private StoreRepository storeRepository;

    public Optional<StoreEntity> getStoreById(Long id) {
        return storeRepository.findById(id);
    }
}
