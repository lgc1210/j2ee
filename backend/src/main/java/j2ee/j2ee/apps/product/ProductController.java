package j2ee.j2ee.apps.product;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.var;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping()
    public ResponseEntity<List<ProductEntity>> getAll() {
        try {
            var productList = this.productService.getAll();
            if (!productList.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(productList.get());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/stores/{store_id}")
    public ResponseEntity<List<ProductEntity>> getAllByStoreId(
            @PathVariable(value = "store_id") long store_id) {
        try {
            var productList = this.productService.getAllByStoreId(store_id);
            if (!productList.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(productList.get());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{product_id}")
    public ResponseEntity<ProductEntity> getById(
            @PathVariable(value = "product_id") long product_id) {
        try {
            var product = this.productService.getById(product_id);
            if (!product.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok().body(product.get());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
