package j2ee.j2ee.apps.store;

import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import j2ee.j2ee.apps.user.UserEntity;

import org.springframework.http.ResponseEntity;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import j2ee.j2ee.apps.user.UserRepository;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StoreService storeService;

    // Get stores to render for customer with pagination
    @GetMapping
    public ResponseEntity<Object> getAll(
            @RequestParam(required = false) int page,
            @RequestParam(required = false) int size,
            @RequestParam(required = false) Long categoryOfServiceId) {
        try {
            if (categoryOfServiceId != null) {
                List<StoreEntity> filteredStores = storeService.filterByCategoryOfServiceId(categoryOfServiceId);
                Map<String, Object> response = new HashMap<>();
                response.put("stores", filteredStores);
                response.put("totalElements", filteredStores.size());
                response.put("filtered", true);
                return ResponseEntity.ok(response);
            }
            Page<StoreEntity> pageStores = this.storeService.getAllStorePage(page, size);
            if (pageStores.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            HashMap<String, Object> response = new HashMap<>();
            response.put("stores", pageStores.getContent());
            response.put("totalPages", pageStores.getTotalPages());
            response.put("totalElements", pageStores.getTotalElements());
            response.put("currentPage", pageStores.getNumber());
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get stores to render for admin without pagination
    @GetMapping("/admin")
    public ResponseEntity<List<StoreEntity>> getAllForAdmin() {
        try {
            Optional<List<StoreEntity>> storeList = this.storeService.getAllForAdmin();
            if (!storeList.isPresent())
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok().body(storeList.get());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get stores to render for admin without pagination
    @GetMapping("/{storeId}")
    public ResponseEntity<StoreEntity> getById(@PathVariable Long storeId) {
        try {
            Optional<StoreEntity> store = this.storeService.getById(storeId);
            if (!store.isPresent())
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok().body(store.get());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get stores to render for admin without pagination
    @GetMapping("/admin/owners/{ownerId}")
    public ResponseEntity<StoreEntity> getStoreByOwnerId(@PathVariable Long ownerId) {
        try {
            Optional<StoreEntity> store = this.storeService.getByOwnerId(ownerId);
            if (!store.isPresent())
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok().body(store.get());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/close_time")
    public ResponseEntity<Object> getStoreCloseTime(@RequestParam("store_id") Long store_id) {
        try {
            Optional<StoreEntity> store = storeService.getById(store_id);
            if (!store.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok().body(store.get().getClose_time());
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/mystore")
    public ResponseEntity<StoreEntity> getStoreByLoggedInUser(Authentication authentication) {
        try {
            String username = authentication.getPrincipal().toString();
            System.out.println("Logged-in username: " + username);

            Optional<UserEntity> userOptional = userRepository.findByEmail(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).build();
            }

            UserEntity loggedInUser = userOptional.get();
            System.out.println("Logged-in user ID: " + loggedInUser.getId());

            Long userId = loggedInUser.getId();
            Optional<StoreEntity> store = storeService.getStoreByUserId(userId);
            System.out.println("Store: " + store.toString());

            if (store.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(store.get());
        } catch (Exception e) {
            System.err.println("Error fetching store for logged-in user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StoreEntity> updateStoreOwner(
            @PathVariable Long id,
            @RequestPart("store") StoreEntity storeEntity,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            if (image != null && !image.isEmpty()) {
                storeEntity.setImage(image.getBytes());
            }

            storeEntity.setOpen_time(LocalTime.parse(storeEntity.getOpen_time().toString()));
            storeEntity.setClose_time(LocalTime.parse(storeEntity.getClose_time().toString()));

            StoreEntity updatedStore = storeService.updateStoreOwner(id, storeEntity);
            return ResponseEntity.ok().body(updatedStore);
        } catch (RuntimeException e) {
            System.err.println("Error updating store: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Internal server error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // import
    @PostMapping("/import")
    public ResponseEntity<String> importStores(@RequestBody List<StoreEntity> stores) {
        storeService.importStores(stores);
        return ResponseEntity.ok("Import successful");
    }

    // Delete store (change status)
    @DeleteMapping("/{storeId}")
    public ResponseEntity<Object> softDelete(@PathVariable Long storeId) {
        try {
            Optional<StoreEntity> updatedStore = this.storeService.softDeleteById(storeId);
            if (!updatedStore.isPresent())
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok().body(updatedStore);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
