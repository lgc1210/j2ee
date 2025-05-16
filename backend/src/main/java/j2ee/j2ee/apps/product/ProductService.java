package j2ee.j2ee.apps.product;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import j2ee.j2ee.apps.category.CategoryRepository;
import j2ee.j2ee.apps.category.CategoryEntity;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Optional<List<ProductEntity>> getAll() {
        List<ProductEntity> productList = this.productRepository.findAll();
        return Optional.of(productList);
    }

    public Page<ProductEntity> getAllByStoreId(long storeId, int page, int size, String name, String category) {
        Pageable pageable = PageRequest.of(page, size);

        if (name != null && !name.isEmpty() && category != null && !category.isEmpty()) {
            return productRepository.findAllByStoreIdAndNameContainingIgnoreCaseAndCategoryContainingIgnoreCase(storeId, name, category, pageable);
        } else if (name != null && !name.isEmpty()) {
            return productRepository.findAllByStoreIdAndNameContainingIgnoreCase(storeId, name, pageable);
        } else if (category != null && !category.isEmpty()) {
            return productRepository.findAllByStoreIdAndCategoryContainingIgnoreCase(storeId, category, pageable);
        }

        return this.productRepository.findAllByStoreId(storeId, pageable);
    }

    public Optional<ProductEntity> getById(Long id) {
        return productRepository.findById(id);
    }

    public List<ProductEntity> getAllByLoggedInUser(long userId) {
        return productRepository.findAllByLoggedInUser(userId);
    }

    public ProductEntity createProduct(ProductEntity product) {
         CategoryEntity category = categoryRepository.findById(product.getCategory().getId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

    // Gán CategoryEntity đã tồn tại vào ProductEntity
    product.setCategory(category);
        return productRepository.save(product);
    }

    public ProductEntity updateProduct(long productId, ProductEntity productDetails) {
        ProductEntity existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setName(productDetails.getName());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setOld_price(productDetails.getOld_price());
        existingProduct.setWeight(productDetails.getWeight());
        existingProduct.setStock_quantity(productDetails.getStock_quantity());
        existingProduct.setStatus(productDetails.getStatus());
        existingProduct.setCategory(productDetails.getCategory());
        return productRepository.save(existingProduct);
    }

    public void deleteProduct(long productId) {
        productRepository.deleteById(productId);
    }

    public void deleteMultipleProducts(List<Long> productIds) {
        productRepository.deleteAllById(productIds);
    }
}
