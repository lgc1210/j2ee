package j2ee.j2ee.apps.store;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalTime;
import java.util.HashMap;
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
            @RequestParam(name = "size") int size
    ) {
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
    public ResponseEntity<Object> getStoreCloseTime(@RequestParam("store_id") Long store_id){
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

    // // Create
    // @PostMapping
    // public ResponseEntity<StoreDTO> createStore(@RequestBody StoreDTO storeDTO) {
    // try {
    // StoreDTO createdStore = storeService.createStore(storeDTO);
    // return ResponseEntity.ok(createdStore);
    // } catch (Exception e) {
    // e.printStackTrace();
    // return ResponseEntity.badRequest().body(null);
    // }
    // }

    // // Lấy tất cả stores
    // @GetMapping
    // public ResponseEntity<List<StoreDTO>> getAllStores() {
    // try {
    // List<StoreDTO> stores = storeService.getAllStores();
    // return ResponseEntity.ok(stores);
    // } catch (Exception e) {
    // return ResponseEntity.badRequest().body(null);
    // }
    // }

    // // Lấy store theo ID
    // @GetMapping("/{id}")
    // public ResponseEntity<StoreDTO> getStoreById(@PathVariable Long id) {
    // try {
    // StoreDTO store = storeService.getStoreById(id);
    // return ResponseEntity.ok(store);
    // } catch (RuntimeException e) {
    // return ResponseEntity.badRequest().body(null);
    // }
    // }

    // // Update
    // @PutMapping("/{id}")
    // public ResponseEntity<StoreDTO> updateStore(@PathVariable Long id,
    // @RequestBody StoreDTO storeDTO) {
    // try {
    // StoreDTO updatedStore = storeService.updateStore(id, storeDTO);
    // return ResponseEntity.ok(updatedStore);
    // } catch (RuntimeException e) {
    // return ResponseEntity.badRequest().body(null);
    // }
    // }

    // // Delete
    // @DeleteMapping("/{id}")
    // public ResponseEntity<String> deleteStore(@PathVariable Long id) {
    // try {
    // storeService.deleteStore(id);
    // return ResponseEntity.ok("Xóa store thành công");
    // } catch (RuntimeException e) {
    // return ResponseEntity.badRequest().body("Lỗi khi xóa: " + e.getMessage());
    // }
    // }

    // // Deletes
    // @DeleteMapping("/delete-multiple")
    // @Transactional
    // public ResponseEntity<String> deleteMultipleStores(@RequestBody List<Long>
    // ids) {
    // try {
    // if (ids == null || ids.isEmpty()) {
    // return ResponseEntity.badRequest().body("Danh sách ID không được rỗng");
    // }
    // storeService.deleteMultipleStores(ids);
    // return ResponseEntity.ok("Xóa nhiều store thành công");
    // } catch (RuntimeException e) {
    // return ResponseEntity.badRequest().body("Lỗi khi xóa: " + e.getMessage());
    // }
    // }
}
