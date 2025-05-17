package j2ee.j2ee.apps.product;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserService;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

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

    // Products Owner
    @GetMapping("/ListProducts")
    public ResponseEntity<List<ProductEntity>> getAllByLoggedInUser(Authentication authentication) {
        try {
            // Lấy thông tin username từ Authentication
            String username = authentication.getPrincipal().toString();
            System.out.println("Logged-in username: " + username);

            // Tìm UserEntity dựa trên email (username)
            Optional<UserEntity> userOptional = userService.getByEmail(username);
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
    public ResponseEntity<ProductEntity> createProduct(
            @RequestBody ProductEntity product,
            Authentication authentication) {
        try {
            ProductEntity createdProduct = productService.createProduct(product, authentication);
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

     @PostMapping("/upload")
public Map<String, String> uploadFile(@RequestParam("image") MultipartFile file) throws IOException {
    // Lấy đường dẫn tuyệt đối đến thư mục uploads ở gốc dự án
    String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
    File dir = new File(uploadDir);
    if (!dir.exists()) {
        dir.mkdirs(); // Tạo thư mục nếu chưa có
    }
    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    File dest = new File(uploadDir + fileName);
    file.transferTo(dest);

    Map<String, String> result = new HashMap<>();
    result.put("image", fileName);
    return result;
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
