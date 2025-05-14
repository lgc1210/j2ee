package j2ee.j2ee.apps.category_of_service;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/categoryOfServices")
public class CategoryOfServiceController {

    @Autowired
    private CategoryOfServiceService categoryService;

    // Create
    @PostMapping
    public ResponseEntity<CategoryOfServiceDTO> createCategory(
            @RequestBody CategoryOfServiceDTO categoryDTO) {
        try {
            CategoryOfServiceDTO createdCategory = categoryService.createCategory(categoryDTO);
            return ResponseEntity.ok(createdCategory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Lấy tất cả categories
    @GetMapping
    public ResponseEntity<List<CategoryOfServiceDTO>> getAllCategories() {
        try {
            List<CategoryOfServiceDTO> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Lấy category theo ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoryOfServiceDTO> getCategoryById(@PathVariable Integer id) {
        try {
            CategoryOfServiceDTO category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<CategoryOfServiceDTO> updateCategory(@PathVariable Integer id,
            @RequestBody CategoryOfServiceDTO categoryDTO) {
        try {
            CategoryOfServiceDTO updatedCategory = categoryService.updateCategory(id, categoryDTO);
            return ResponseEntity.ok(updatedCategory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Integer id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok("Xóa category thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa: " + e.getMessage());
        }
    }

    // Deletes
    @DeleteMapping("/delete-multiple")
    @Transactional
    public ResponseEntity<String> deleteMultipleCategories(@RequestBody List<Integer> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body("Danh sách ID không được rỗng");
            }
            categoryService.deleteMultipleCategories(ids);
            return ResponseEntity.ok("Xóa nhiều category thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa: " + e.getMessage());
        }
    }
}
