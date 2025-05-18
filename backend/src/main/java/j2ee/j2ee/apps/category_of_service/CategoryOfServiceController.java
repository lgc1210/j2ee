package j2ee.j2ee.apps.category_of_service;

import j2ee.j2ee.apps.store.StoreEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categoryOfServices")
public class CategoryOfServiceController {

    @Autowired
    private CategoryOfServiceService categoryService;

    // Create
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryOfServiceEntity> createCategory(
            @RequestPart(value = "categoryOfService") CategoryOfServiceEntity categoryOfService,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            if (image != null && !image.isEmpty()) {
                categoryOfService.setImage(image.getBytes());
            }

            CategoryOfServiceEntity createdCategory = categoryService.createCategory(categoryOfService);
            return ResponseEntity.ok(createdCategory);
        } catch (RuntimeException e) {
            System.err.println("Error updating store: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Internal server error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get all categories
    @GetMapping
    public ResponseEntity<List<CategoryOfServiceEntity>> getAllCategories() {
        Optional<List<CategoryOfServiceEntity>> categories = categoryService.getAll();
        return ResponseEntity.ok(categories.orElseThrow(() -> new RuntimeException("No categories found")));
    }

    // Get category by ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoryOfServiceEntity> getCategoryById(@PathVariable Long id) {
        CategoryOfServiceEntity category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    // Update
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CategoryOfServiceEntity> updateCategory(
            @PathVariable Long id,
            @RequestPart("categoryOfService") CategoryOfServiceEntity categoryOfService,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            if (image != null && !image.isEmpty()) {
                categoryOfService.setImage(image.getBytes());
            }
            CategoryOfServiceEntity updatedCategory = categoryService.updateCategory(id, categoryOfService);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            System.err.println("Error updating store: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Internal server error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Xóa category thành công");
    }

    // Delete multiple
    @DeleteMapping("/delete-multiple")
    public ResponseEntity<String> deleteMultipleCategories(@RequestBody List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest().body("Danh sách ID không được rỗng");
        }
        categoryService.deleteMultipleCategories(ids);
        return ResponseEntity.ok("Xóa nhiều category thành công");
    }
}