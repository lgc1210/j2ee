package j2ee.j2ee.apps.user;

import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import j2ee.j2ee.constants.ErrorMessages;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping()
    public ResponseEntity<List<UserEntity>> getAll() {
        try {
            var userList = userService.getAll();
            if (userList.size() == 0)
                return ResponseEntity.notFound().build();

            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<UserEntity>> getById(@PathVariable(value = "id") long id) {
        try {
            var user = userService.getById(id);
            if (!user.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Object> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        String email = principal.getName();
        Optional<UserEntity> user = userService.getByEmail(email);
        return user.isPresent() ? ResponseEntity.ok(user.get()) : ResponseEntity.notFound().build();
    }

    @PostMapping("createUser")
    public ResponseEntity<UserEntity> create(@RequestBody UserEntity user) {
        try {
            if (user == null)
                return ResponseEntity.badRequest().build();

            Optional<UserEntity> doesEmailExist = userService.getByEmail(user.getEmail());
            Optional<UserEntity> doesPhoneExist = userService.getByPhone(user.getPhone());
            System.out.println("Email exists: " + doesEmailExist.isPresent());
            System.out.println("Phone exists: " + doesPhoneExist.isPresent());
            if (doesEmailExist.isPresent() || doesPhoneExist.isPresent())
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            UserEntity createdUser = userService.create(user);

            URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                    .buildAndExpand(createdUser.getId()).toUri();

            return ResponseEntity.created(uri).body(createdUser);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable(name = "id") long id,
            @RequestBody UserEntity user) {
        try {
            if (user == null) {
                return ResponseEntity.badRequest().build();
            }

            Optional<UserEntity> existingUser = userService.getById(id);
            if (!existingUser.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            UserEntity updatedUser = userService.update(id, user);

            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            if (e.getMessage().equals(ErrorMessages.EMAIL_CONFLICT)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ErrorMessages.EMAIL_CONFLICT);
            }
            if (e.getMessage().equals(ErrorMessages.PHONE_CONFLICT)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ErrorMessages.PHONE_CONFLICT);
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Failed to update user");
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{id}/changepassword")
    public ResponseEntity<?> changePassword(@PathVariable(name = "id") long id,
            @RequestBody Map<String, String> request) {
        try {
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().build();
            }

            Optional<UserEntity> updatedUser =
                    userService.changePassword(id, currentPassword, newPassword);
            if (!updatedUser.isPresent()) {
                return ResponseEntity.badRequest().body("Incorrect current password");
            }

            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/getlistbyroleid/{roleId}")
    public ResponseEntity<List<UserEntity>> getUsersByRoleId(@PathVariable Long roleId) {
        return ResponseEntity.ok(userService.getUsersByRoleId(roleId));
    }

    // Delete (Xóa một store)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Xóa user thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa: " + e.getMessage());
        }
    }

    // Delete (Xóa nhiều stores)
    @DeleteMapping("/delete-multiple")
    @Transactional
    public ResponseEntity<String> deleteMultipleUsers(@RequestBody List<Long> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body("Danh sách ID không được rỗng");
            }
            userService.deleteMultipleUsers(ids);
            return ResponseEntity.ok("Xóa nhiều user thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa: " + e.getMessage());
        }
    }



}
