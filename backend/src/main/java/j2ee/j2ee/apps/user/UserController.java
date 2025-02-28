package j2ee.j2ee.apps.user;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<List<UserEntity>> getAll() {
        try {
            var userList = userService.getAll();
            if (userList.size() == 0)
                return ResponseEntity.notFound().build();

            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<UserEntity>> getById(@PathVariable(value = "id") long id) {
        try {
            var user = userService.getById(id);
            if (!user.isPresent())
                return ResponseEntity.notFound().build();

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // @PostMapping("/")
    // public ResponseEntity<String> create(@RequestBody UserEntity request) {
    // try {
    // // var createdUser =
    // // URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
    // // .path("/{id}")
    // // .buildAndExpand(createdUser.getId())
    // // .toUri();

    // // ResponseEntity.created(uri).body("User created successfully");
    // } catch (Exception e) {
    // return ResponseEntity.internalServerError().build();
    // }
    // }
}
