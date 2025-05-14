package j2ee.j2ee.apps.cart;

import java.util.ArrayList;
import java.util.Optional;

import j2ee.j2ee.apps.product.ProductEntity;
import j2ee.j2ee.apps.user.UserEntity;
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

    public Optional<CartEntity> getByUserId(Long user_id) {
        return this.cartRepository.findByUserId(user_id);
    }

    @Transactional
    public void changeQuantity(Long userId, Long productId, int quantity) {
        Optional<CartEntity> cartOptional = cartRepository.findByUserId(userId);
        Optional<ProductEntity> productOptional = productRepository.findById(productId);

        if (!productOptional.isPresent()) {
            return;
        }

        ProductEntity product = productOptional.get();
        if (!product.getIs_in_stock()) {
            return;
        }

        CartEntity cart;
        if (cartOptional.isPresent()) {
            cart = cartOptional.get();
        } else {
            cart = new CartEntity();
            UserEntity user = new UserEntity();
            user.setId(userId);
            cart.setUser(user);
            cart.setItems(new ArrayList<>());
        }

        var items = cart.getItems();
        var existingItem = items.stream()
                .filter(item -> item.getProduct().getId() == productId)
                .findFirst();

        int newQuantity = existingItem.map(item -> item.getQuantity() + quantity)
                .orElse(quantity);

        if (newQuantity < 0) {
            if (existingItem.isPresent()) {
                items.remove(existingItem.get());
            }
            cartRepository.save(cart);
            return;
        }

        if (newQuantity > product.getStock_quantity()) {
            return;
        }

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(newQuantity);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            items.add(cartItem);
        }

        cartRepository.save(cart);
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
