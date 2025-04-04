package j2ee.j2ee.apps.product_image;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductImageService {
    private final ProductImageRepository productImageRepository;

    @Autowired
    public ProductImageService(ProductImageRepository productImageRepository) {
        this.productImageRepository = productImageRepository;
    }

    public Optional<List<ProductImageEntity>> getAllByProductId(long productId) {
        List<ProductImageEntity> imageList = this.productImageRepository.findAllByProductId(productId);
        return Optional.ofNullable(imageList);
    }
}
