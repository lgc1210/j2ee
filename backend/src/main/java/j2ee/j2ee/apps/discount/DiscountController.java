package j2ee.j2ee.apps.discount;

import java.util.HashMap;
import java.util.Optional;
import java.util.List;

import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

    @Autowired
    private UserService userService;
    @Autowired
    private DiscountService discountService;

    @GetMapping("/ListDiscounts")
    public ResponseEntity<List<DiscountEntity>> getAllByLoggedInUser(Authentication authentication) {
        try {
           System.out.println("Authentication: " + authentication);
        if (authentication == null) {
            System.out.println("Authentication is null!");
            return ResponseEntity.status(401).build();
        }
            String username = authentication.getPrincipal().toString();
            System.out.println("Logged-in username: " + username);

           
            Optional<UserEntity> userOptional = userService.getByEmail(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).build();
            }

            
            UserEntity loggedInUser = userOptional.get();
            System.out.println("Logged-in user ID: " + loggedInUser.getId());
            Long userId = loggedInUser.getId();

            
            var discountList = this.discountService.getAllDiscountsByUserId(userId);
            if (discountList.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(discountList);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<DiscountEntity> createDiscount(@RequestBody DiscountEntity discountEntity, Authentication authentication) {
        try {
            DiscountEntity createdDiscount = discountService.createDiscount(discountEntity, authentication);
            return ResponseEntity.ok(createdDiscount);
        } catch (Exception e) {
            System.err.println("Error creating discount: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{discountId}")
    public ResponseEntity<DiscountEntity> updateDiscount(
            @PathVariable Long discountId,
            @RequestBody DiscountEntity discountEntity) {
        try {
            DiscountEntity updatedDiscount = discountService.updateDiscount(discountId, discountEntity);
            if (updatedDiscount == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedDiscount);
        } catch (Exception e) {
            System.err.println("Error updating discount: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{discount_id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable(value = "discount_id") long discountId) {
        try {
            Optional<DiscountEntity> existingDiscount = discountService.getById(discountId);
            if (existingDiscount.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            discountService.deleteDiscount(discountId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting discount: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteMultipleDiscounts(@RequestBody List<Long> discountIds) {
        try {
            discountService.deleteMultipleDiscounts(discountIds);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting multiple discounts: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}