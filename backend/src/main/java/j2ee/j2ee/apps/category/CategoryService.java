package j2ee.j2ee.apps.category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import j2ee.j2ee.apps.category.CategoryEntity;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryEntity> getAllByLoggedInUser(long userId) {
        return categoryRepository.findAllByLoggedInUser(userId);
    }

    // Lấy danh mục theo ID
    public Optional<CategoryEntity> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }
}
