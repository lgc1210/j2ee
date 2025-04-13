package j2ee.j2ee.apps.address_book;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jersey.JerseyProperties.Servlet;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import lombok.var;

@RestController
@RequestMapping("/api/addresses")
public class AddressBookController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String externalApi = "https://provinces.open-api.vn/api/?depth=3";
    private final AddressBookService addressBookService;

    @Autowired
    public AddressBookController(AddressBookService addressBookService) {
        this.addressBookService = addressBookService;
    }

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

    @GetMapping("/users/{user_id}")
    public ResponseEntity<Object> getAllByUserId(@PathVariable(value = "user_id") long user_id) {
        try {
            Optional<List<AddressBookEntity>> addressList =
                    addressBookService.getAllByUserId(user_id);

            if (!addressList.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(addressList);
        } catch (Exception e) {
            System.out.println("Internal Server Errors:" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

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

    @PostMapping()
    public ResponseEntity<Object> create(@RequestBody AddressBookEntity payload) {
        try {
            var createdAddress = this.addressBookService.create(payload);

            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(createdAddress.getId())
                    .toUri();

            return ResponseEntity.created(uri).body(createdAddress);
        } catch (Exception e) {
            System.out.println("Internal Server Errors:" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> update(
            @PathVariable(value = "id") long id, @RequestBody AddressBookEntity payload) {
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
