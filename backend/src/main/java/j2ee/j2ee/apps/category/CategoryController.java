package j2ee.j2ee.apps.category;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import j2ee.j2ee.apps.appointment.AppointmentEntity;
import j2ee.j2ee.apps.payment.PaymentDTO;
import j2ee.j2ee.apps.payment.PaymentEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<CategoryEntity> getAllCategories() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryEntity> getCategoryById(@PathVariable Long id) {
        return categoryService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("active")
    public List<CategoryEntity> getAllActiveCategories() {
        return categoryService.getAllActiveCategories();
    }

    @PostMapping
    public CategoryEntity createCategory(@RequestBody CategoryEntity category) {
        return categoryService.createCategory(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryEntity> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryEntity categoryDetails) {

        Optional<CategoryEntity> categoryOpt = categoryService.getById(id);

        if (!categoryOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        CategoryEntity category = categoryOpt.get();
        category.setName(categoryDetails.getName());
        category.setStore(categoryDetails.getStore());

        CategoryEntity updatedCategory = categoryService.updateCategory(id, category).get();

        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Optional<CategoryEntity> deleted = categoryService.deleteCategory(id);
        if (deleted.isPresent()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}
