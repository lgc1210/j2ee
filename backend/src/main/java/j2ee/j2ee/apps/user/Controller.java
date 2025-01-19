package j2ee.j2ee.apps.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Controller {

    @GetMapping("/customer")
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("This is sayHello method.");
    }
}
