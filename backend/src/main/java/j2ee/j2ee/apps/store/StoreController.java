package j2ee.j2ee.apps.store;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @GetMapping
    public ResponseEntity<Object> getAll(
            @RequestParam(name = "page") int page,
            @RequestParam(name = "size") int size) {
        try {
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

    // import
    @PostMapping("/import")
    public ResponseEntity<String> importStores(@RequestBody List<StoreEntity> stores) {
        storeService.importStores(stores);
        return ResponseEntity.ok("Import successful");
    }
}
