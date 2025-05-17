package j2ee.j2ee.apps.product;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import j2ee.j2ee.apps.category.CategoryRepository;
import j2ee.j2ee.apps.store.StoreEntity;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.category.CategoryEntity;
import j2ee.j2ee.apps.store.StoreRepository;
import j2ee.j2ee.apps.user.UserRepository;
import org.springframework.security.core.Authentication;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private UserRepository userRepository;

    public Optional<List<ProductEntity>> getAll() {
        List<ProductEntity> productList = this.productRepository.findAll();
        return Optional.ofNullable(productList);
    }

    public Optional<List<ProductEntity>> getAllByStoreId(long storeId) {
        List<ProductEntity> productList = this.productRepository.findAllByStoreId(storeId);
        return Optional.ofNullable(productList);
    }

    public Optional<ProductEntity> getById(long id) {
        return this.productRepository.findById(id);
    }

    public List<ProductEntity> getAllByLoggedInUser(long userId) {
        return productRepository.findAllByLoggedInUser(userId);
    }

    public ProductEntity createProduct(ProductEntity product, Authentication authentication) {
        // Lấy thông tin username từ Authentication
        String username = authentication.getPrincipal().toString();
        System.out.println("Logged-in username: " + username);

        // Tìm UserEntity dựa trên email (username)
        UserEntity user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tìm StoreEntity dựa trên owner_id (userId)
        StoreEntity store = storeRepository.findStoreByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Store not found for the logged-in user"));

        // Tìm CategoryEntity dựa trên categoryId
        CategoryEntity category = categoryRepository.findById(product.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Gán StoreEntity và CategoryEntity vào ProductEntity
        product.setStore(store);
        product.setCategory(category);

        // Lưu ProductEntity
        return productRepository.save(product);
    }

    public ProductEntity updateProduct(long productId, ProductEntity productDetails) {
        ProductEntity existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        CategoryEntity category = categoryRepository.findById(productDetails.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existingProduct.setName(productDetails.getName());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setOld_price(productDetails.getOld_price());
        existingProduct.setWeight(productDetails.getWeight());
        existingProduct.setStock_quantity(productDetails.getStock_quantity());
        existingProduct.setImage(productDetails.getImage());
        existingProduct.setStatus(productDetails.getStatus());
        existingProduct.setCategory(category);
        return productRepository.save(existingProduct);
    }

    public void deleteProduct(long productId) {
        productRepository.deleteById(productId);
    }

    public void deleteMultipleProducts(List<Long> productIds) {
        productRepository.deleteAllById(productIds);
    }
}
