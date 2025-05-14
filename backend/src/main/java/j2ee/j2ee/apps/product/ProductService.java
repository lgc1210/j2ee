package j2ee.j2ee.apps.product;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

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

    public Optional<ProductEntity> getById(long id) {
        return this.productRepository.findById(id);
    }
}
