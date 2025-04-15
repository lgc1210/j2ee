package j2ee.j2ee.apps.cart;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import j2ee.j2ee.apps.product.ProductRepository;
import jakarta.transaction.Transactional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public Optional<CartEntity> getByUserId(long user_id) {
        return Optional.ofNullable(this.cartRepository.findByUserId(user_id));
    }

    @Transactional
    public void addToCart(long card_id, long product_id, int quantity) {
        var cart = this.cartRepository.findById(card_id).get();
        var product = this.productRepository.findById(product_id).get();
        var items = cart.getItems();
        var existingItem = items.stream().filter(item -> item.getProduct().getId() == product_id).findFirst();

        if (!existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            var cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            items.add(cartItem);
        }

        this.cartRepository.save(cart);
    }

    @Transactional
    public void deleteFromCart(long cart_id, long product_id) {
        var cart = this.cartRepository.findById(cart_id);
        if (cart.isPresent()) {
            cart.get().getItems().removeIf(item -> item.getProduct().getId() == product_id);
            this.cartRepository.save(cart.get());
        }
    }
}
