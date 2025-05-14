package j2ee.j2ee.apps.cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    public record CartItemRequest(Long userId, Long productId, int quantity) {
    }

    @PostMapping
    public ResponseEntity<?> changeQuantity(@RequestBody CartItemRequest payload) {
        try {
            this.cartService.changeQuantity(payload.userId(), payload.productId(), payload.quantity());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteFromCart(@RequestParam("cart_id") Long cart_id, @RequestParam("product_id") Long product_id) {
        try {
            this.cartService.deleteFromCart(cart_id, product_id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/customers")
    public ResponseEntity<?> getCartByCustomerId(@RequestParam("customer_id") Long customer_id) {
        try {
            var cart = cartService.getByUserId(customer_id);
            return ResponseEntity.ok().body(cart);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
