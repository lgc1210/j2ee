package j2ee.j2ee.apps.store;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StoreService {
    private StoreRepository storeRepository;

    @Autowired
    public StoreService(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    public Optional<List<StoreEntity>> getAll() {
        List<StoreEntity> storeList = this.storeRepository.findAll();
        return Optional.ofNullable((storeList));
    }

    public Optional<StoreEntity> getById(long id) {
        return this.storeRepository.findById(id);
    }
}
