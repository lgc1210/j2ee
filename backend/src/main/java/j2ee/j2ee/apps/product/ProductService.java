package j2ee.j2ee.apps.product;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

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
}
