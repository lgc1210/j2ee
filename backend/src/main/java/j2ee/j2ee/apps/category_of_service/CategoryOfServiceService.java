package j2ee.j2ee.apps.category_of_service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryOfServiceService {

    @Autowired
    private CategoryOfServiceRepository categoryRepository;

    // Chuyển từ CategoryOfServiceEntity sang CategoryOfServiceDTO
    private CategoryOfServiceDTO toDTO(CategoryOfServiceEntity entity) {
        CategoryOfServiceDTO dto = new CategoryOfServiceDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setImage(entity.getImage());
        dto.setStatus(entity.getStatus());
        return dto;
    }

    // Chuyển từ CategoryOfServiceDTO sang CategoryOfServiceEntity
    private CategoryOfServiceEntity toEntity(CategoryOfServiceDTO dto) {
        CategoryOfServiceEntity entity = new CategoryOfServiceEntity();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setImage(dto.getImage());
        entity.setStatus(dto.getStatus());
        return entity;
    }

    // Create (Tạo mới category)
    @Transactional
    public CategoryOfServiceDTO createCategory(CategoryOfServiceDTO categoryDTO) {
        CategoryOfServiceEntity entity = toEntity(categoryDTO);
        CategoryOfServiceEntity savedEntity = categoryRepository.save(entity);
        return toDTO(savedEntity);
    }

    // Read (Lấy tất cả categories)
    public List<CategoryOfServiceDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Read (Lấy category theo ID)
    public CategoryOfServiceDTO getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category với ID: " + id));
    }

    // Update (Cập nhật category)
    @Transactional
    public CategoryOfServiceDTO updateCategory(Integer id, CategoryOfServiceDTO categoryDTO) {

        CategoryOfServiceEntity entity = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category với ID: " + id));
        entity.setName(categoryDTO.getName());
        entity.setImage(categoryDTO.getImage());
        entity.setStatus(categoryDTO.getStatus());
        CategoryOfServiceEntity updatedEntity = categoryRepository.save(entity);
        return toDTO(updatedEntity);
    }

    // Delete
    @Transactional
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy category với ID: " + id);
        }
        categoryRepository.deleteById(id);
    }

    // Delete
    @Transactional
    public void deleteMultipleCategories(List<Integer> ids) {
        categoryRepository.deleteAllByIdIn(ids);
    }
}