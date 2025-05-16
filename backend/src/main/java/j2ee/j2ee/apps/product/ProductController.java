package j2ee.j2ee.apps.product;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserRepository;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private UserRepository userRepository;

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
            @RequestParam(required = false, value = "category") String category) {
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
            System.out.println(product_id);
            var product = this.productService.getById(product_id);

            return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Products Owner
    @GetMapping("/ListProducts")
    public ResponseEntity<List<ProductEntity>> getAllByLoggedInUser(Authentication authentication) {
        try {
            // Lấy thông tin username từ Authentication
            String username = authentication.getPrincipal().toString();
            System.out.println("Logged-in username: " + username);

            // Tìm UserEntity dựa trên email (username)
            Optional<UserEntity> userOptional = userRepository.findByEmail(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).build();
            }

            // Lấy userId từ UserEntity
            UserEntity loggedInUser = userOptional.get();
            System.out.println("Logged-in user ID: " + loggedInUser.getId());
            Long userId = loggedInUser.getId();

            // Lấy danh sách sản phẩm dựa trên userId
            var productList = this.productService.getAllByLoggedInUser(userId);
            if (productList.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(productList);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<ProductEntity> createProduct(@RequestBody ProductEntity product) {
        try {
            ProductEntity createdProduct = productService.createProduct(product);
            return ResponseEntity.ok(createdProduct);
        } catch (Exception e) {
            System.err.println("Error creating product: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{product_id}")
    public ResponseEntity<ProductEntity> updateProduct(
            @PathVariable(value = "product_id") long productId,
            @RequestBody ProductEntity productDetails) {
        try {
            Optional<ProductEntity> existingProduct = productService.getById(productId);
            if (existingProduct.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ProductEntity updatedProduct = productService.updateProduct(productId, productDetails);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            System.err.println("Error updating product: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{product_id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable(value = "product_id") long productId) {
        try {
            Optional<ProductEntity> existingProduct = productService.getById(productId);
            if (existingProduct.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            productService.deleteProduct(productId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting product: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteMultipleProducts(@RequestBody List<Long> productIds) {
        try {
            productService.deleteMultipleProducts(productIds);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting multiple products: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
