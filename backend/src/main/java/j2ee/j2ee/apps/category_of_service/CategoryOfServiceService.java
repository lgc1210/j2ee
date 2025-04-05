package j2ee.j2ee.apps.category_of_service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryOfServiceService {
    private final CategoryOfServiceRepository categoryOfServiceRepository;

    @Autowired
    public CategoryOfServiceService(CategoryOfServiceRepository categoryOfServiceRepository) {
        this.categoryOfServiceRepository = categoryOfServiceRepository;
    }

    public Optional<List<CategoryOfServiceEntity>> getAll() {
        List<CategoryOfServiceEntity> categoryList = this.categoryOfServiceRepository.findAll();
        return Optional.ofNullable(categoryList);
    }
}
