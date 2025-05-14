package j2ee.j2ee.apps.product;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductEntity>> getAll() {
        try {
            var productList = this.productService.getAll();
            return productList.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get product pagination by store id
    @GetMapping("/stores")
    public ResponseEntity<Object> getAllByStoreId(
            @RequestParam(value = "store_id") long store_id,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(required = false, value = "name") String name,
            @RequestParam(required = false, value = "category") String category
    ) {
        try {
            int size = 8;
            var pageProducts = this.productService.getAllByStoreId(store_id, page, size, name, category);
            if (pageProducts.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            HashMap<String, Object> response = new HashMap<>();
            response.put("products", pageProducts.getContent());
            response.put("currentPage", pageProducts.getNumber());
            response.put("totalPages", pageProducts.getTotalPages());
            response.put("totalElements", pageProducts.getTotalElements());

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/details")
    public ResponseEntity<ProductEntity> getById(@RequestParam("product_id") Long product_id) {
        try {
            var product = this.productService.getById(product_id);

            return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
