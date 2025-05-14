package j2ee.j2ee.apps.category;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping()
    public ResponseEntity<List<CategoryEntity>> getAll() {
        try {
            var categoryList = categoryService.getAll();
            if (categoryList.size() == 0)
                return ResponseEntity.notFound().build();

            return ResponseEntity.ok(categoryList);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/getlistbystoreid/{storeId}")
    public ResponseEntity<List<CategoryEntity>> getListByStoreId(@PathVariable Long storeId) {
        return ResponseEntity.ok(categoryService.getListByStoreId(storeId));
    }
}
