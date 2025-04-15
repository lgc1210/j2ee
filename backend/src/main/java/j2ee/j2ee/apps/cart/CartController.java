package j2ee.j2ee.apps.cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    public record CartItemRequest(long cartId, long productId, int quantity) {
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequest payload) {
        try {
            this.cartService.addToCart(payload.cartId(), payload.productId(), payload.quantity());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{cart_id}/products/{product_id}")
    public ResponseEntity<?> deleteFromCart(@PathVariable(value = "cart_id") long cart_id,
            @PathVariable(value = "product_id") long product_id) {
        try {
            this.cartService.deleteFromCart(cart_id, product_id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

}
