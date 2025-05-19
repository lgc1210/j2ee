package j2ee.j2ee.apps.address_book;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/addresses")
public class AddressBookController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String externalApi = "https://provinces.open-api.vn/api/?depth=3";

    @Autowired
    private AddressBookService addressBookService;

    // Get provinces API
    @GetMapping("/provinces")
    public ResponseEntity<String> getProvinces() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(externalApi, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            System.out.println("Internal Server Errors:" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get pageable addresses by user_id
    @GetMapping("/users/{user_id}")
    public ResponseEntity<Object> getAllByUserId(
            @PathVariable(value = "user_id") long user_id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "4") int size) {
        try {
            Page<AddressBookEntity> pageAddresses = addressBookService.getAllByUserId(user_id, page, size);
            if (pageAddresses.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("addresses", pageAddresses.getContent());
            response.put("currentPage", pageAddresses.getNumber());
            response.put("totalPages", pageAddresses.getTotalPages());
            response.put("totalElements", pageAddresses.getTotalElements());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Internal Server Errors:" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete address by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteById(@PathVariable(value = "id") long id) {
        try {
            var address = this.addressBookService.getById(id);
            if (!address.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            this.addressBookService.deleteById(id);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Internal Server Errors:" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Create address
    @PostMapping()
    public ResponseEntity<Object> create(@RequestBody AddressBookEntity payload) {
        try {
            var createdAddress = this.addressBookService.create(payload);

            URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                    .buildAndExpand(createdAddress.getId()).toUri();

            return ResponseEntity.created(uri).body(createdAddress);
        } catch (Exception e) {
            System.out.println("Internal Server Errors:" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Update address by id
    @PutMapping("/update/{id}")
    public ResponseEntity<Object> update(@PathVariable(value = "id") long id, @RequestBody AddressBookEntity payload) {
        try {
            var address = this.addressBookService.getById(id);
            if (!address.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            this.addressBookService.update(id, payload);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Internal Server Errors:" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Set default address by id
    @PutMapping("/{id}")
    public ResponseEntity<Object> setDefaultByUserId(@PathVariable(value = "id") long id,
            @RequestBody AddressBookEntity payload) {
        System.out.println("Payload:" + payload.toString());
        try {
            this.addressBookService.setDefaultById(id, payload.getUser().getId());

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Internal Server Errors:" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
