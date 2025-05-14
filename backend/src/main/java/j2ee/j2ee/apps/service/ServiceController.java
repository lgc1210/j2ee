package j2ee.j2ee.apps.service;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceSerivce;

    // Get service pagination by store id
    @GetMapping("/stores/{store_id}")
    public ResponseEntity<Object> getByStoreId(
            @PathVariable(name = "store_id") long store_id,
            @RequestParam(name = "page") int page,
            @RequestParam(name = "size") int size
    ) {
        try {
            System.out.println("Store id " + store_id);
            Page<ServiceEntity> PageService = serviceSerivce.getByStoreId(store_id, page, size);
            if (PageService.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            HashMap<String, Object> response = new HashMap<>();
            response.put("services", PageService.getContent());
            response.put("totalPages", PageService.getTotalPages());
            response.put("totalElements", PageService.getTotalElements());
            response.put("currentPage", PageService.getNumber());

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
