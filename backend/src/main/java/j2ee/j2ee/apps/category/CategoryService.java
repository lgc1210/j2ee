package j2ee.j2ee.apps.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import java.time.LocalDateTime;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryEntity> getAll() {
        return categoryRepository.findAll();
    }

    public Optional<CategoryEntity> getById(long id) {
        return categoryRepository.findById(id);
    }

    public List<CategoryEntity> getAllActiveCategories() {
        return categoryRepository.findActiveCategories();
    }

    public CategoryEntity createCategory(CategoryEntity category) {
        return categoryRepository.save(category);
    }

    public Optional<CategoryEntity> updateCategory(Long id, CategoryEntity categoryDetails) {
        return categoryRepository.findById(id).map(category -> {
            category.setName(categoryDetails.getName());
            category.setStore(categoryDetails.getStore());
            return categoryRepository.save(category);
        });
    }

    public Optional<CategoryEntity> deleteCategory(Long id) {
        Optional<CategoryEntity> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isPresent()) {
            CategoryEntity category = categoryOpt.get();
            category.setDeleted_at(LocalDateTime.now());
            categoryRepository.save(category);
            return Optional.of(category);
        }
        return Optional.empty();
    }

    // Lấy tất cả danh mục
    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Lấy danh mục theo ID
    public Optional<CategoryEntity> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }
}
