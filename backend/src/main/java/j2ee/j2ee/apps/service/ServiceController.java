package j2ee.j2ee.apps.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceSerivce;

    @GetMapping("/{storeId}")
    public ResponseEntity<Optional<ServiceEntity>> getByStoreId(@PathVariable int storeId) {
        try {
            Optional<ServiceEntity> service = serviceSerivce.getByStoreId(storeId);
            if (!service.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
