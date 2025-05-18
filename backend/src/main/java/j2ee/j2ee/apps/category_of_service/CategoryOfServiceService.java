package j2ee.j2ee.apps.category_of_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryOfServiceService {

    @Autowired
    private CategoryOfServiceRepository categoryRepository;

    public Optional<List<CategoryOfServiceEntity>> getAll() {
        List<CategoryOfServiceEntity> categoryList = categoryRepository.findAll();
        return Optional.ofNullable(categoryList);
    }

    // Create
    public CategoryOfServiceEntity createCategory(CategoryOfServiceEntity category) {
        return categoryRepository.save(category);
    }

    // Get all categories
    public List<CategoryOfServiceEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get category by ID
    public CategoryOfServiceEntity getCategoryById(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy category với ID: " + id));
    }

    // Update
    @Transactional
    public CategoryOfServiceEntity updateCategory(Long id, CategoryOfServiceEntity category) {
        CategoryOfServiceEntity entity = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy category với ID: " + id));
        entity.setName(category.getName());
        entity.setImage(category.getImage());
        entity.setStatus(category.getStatus());
        return categoryRepository.save(entity);
    }

    // Delete
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy category với ID: " + id);
        }
        categoryRepository.deleteById(id);
    }

    // Delete multiple
    @Transactional
    public void deleteMultipleCategories(List<Long> ids) {
        categoryRepository.deleteAllByIdIn(ids);
    }
}