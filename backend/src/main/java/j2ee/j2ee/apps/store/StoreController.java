package j2ee.j2ee.apps.store;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired
    private StoreService storeService;

    @GetMapping
    public ResponseEntity<List<StoreEntity>> getAll() {
        try {
            var storeList = storeService.getAll();
            if (!storeList.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok().body(storeList.get());
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
