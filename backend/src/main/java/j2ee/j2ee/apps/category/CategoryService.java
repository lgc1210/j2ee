package j2ee.j2ee.apps.category;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import j2ee.j2ee.apps.store.StoreDTO;
import j2ee.j2ee.apps.store.StoreEntity;
import j2ee.j2ee.apps.store.StoreRepository;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserRepository;
import j2ee.j2ee.constants.ErrorMessages;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import j2ee.j2ee.apps.role.RoleEntity;
import j2ee.j2ee.apps.role.RoleRepository;
import j2ee.j2ee.constants.ErrorMessages;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, StoreRepository storeRepository) {
        this.categoryRepository = categoryRepository;
        this.storeRepository = storeRepository;
    }

    public List<CategoryEntity> getAll() {
        return categoryRepository.findAll();
    }

    public Optional<CategoryEntity> getById(long id) {
        return categoryRepository.findById(id);
    }

    public List<CategoryEntity> getListByStoreId(Long storeId) {
        return categoryRepository.findByStoreId(storeId);
    }
}
