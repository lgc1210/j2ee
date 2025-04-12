package j2ee.j2ee.apps.address_book;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import j2ee.j2ee.constants.ErrorMessages;

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
    public ResponseEntity<Object> getAllByUserId(@Param("user_id") long user_id) {
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

    @PostMapping()
    public ResponseEntity<Object> create(@RequestBody AddressBookEntity payload) {
        try {
            AddressBookEntity createdAddress = addressBookService.create(payload);
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                    .buildAndExpand(createdAddress.getId()).toUri();

            return ResponseEntity.created(uri).body(createdAddress);
        } catch (RuntimeException e) {
            if (e.getMessage().equals(ErrorMessages.ADDRESS_CONFLICT)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ErrorMessages.ADDRESS_CONFLICT);
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Failed to create address");
        } catch (Exception e) {
            System.out.println("Internal Server Errors:" + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
