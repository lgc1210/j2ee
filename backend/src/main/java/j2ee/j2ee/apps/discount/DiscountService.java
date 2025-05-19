package j2ee.j2ee.apps.discount;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import java.util.List;
import java.util.Optional;

@Service
public class DiscountService {

    @Autowired
    private DiscountRepository discountRepository;

    public List<DiscountEntity> getAllDiscountsByUserId(Long userId) {
       
        return discountRepository.findAllByLoggedInUser(userId);
    }

    public DiscountEntity createDiscount(DiscountEntity discountEntity, Authentication authentication) {
        // Có thể set thêm thông tin store hoặc user nếu cần
        return discountRepository.save(discountEntity);
    }

    public DiscountEntity updateDiscount(Long discountId, DiscountEntity discountEntity) {
        Optional<DiscountEntity> existing = discountRepository.findById(discountId);
        if (existing.isPresent()) {
            DiscountEntity discount = existing.get();
            discount.setCode(discountEntity.getCode());
            discount.setDescription(discountEntity.getDescription());
            discount.setValue(discountEntity.getValue());
            discount.setStore(discountEntity.getStore());
            return discountRepository.save(discount);
        }
        return null;
    }

    public Optional<DiscountEntity> getById(Long id) {
        return discountRepository.findById(id);
    }

    public void deleteDiscount(Long discountId) {
        discountRepository.deleteById(discountId);
    }

    public void deleteMultipleDiscounts(List<Long> discountIds) {
        discountRepository.deleteAllById(discountIds);
    }
}