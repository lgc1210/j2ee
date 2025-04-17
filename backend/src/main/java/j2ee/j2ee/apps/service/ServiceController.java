package j2ee.j2ee.apps.service;

import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceSerivce;

    @GetMapping("/{storeId}")
    public ResponseEntity<Object> getByStoreId(
            @PathVariable int storeId,
            @RequestParam("page") int page,
            @RequestParam("size") int size
    ) {
        try {
            Page<ServiceEntity> PageService = serviceSerivce.getByStoreId(storeId, page, size);
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
