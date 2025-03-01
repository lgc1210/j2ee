package j2ee.j2ee.apps.auth;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import j2ee.j2ee.apps.user.UserEntity;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    // @PostMapping("/login")
    // public ResponseEntity<UserEntity> login(@RequestBody UserEntity user) {
    // try {
    // if (user == null)
    // return ResponseEntity.badRequest().build();

    // Optional<UserEntity> emailDoesExist =
    // authService.getByEmail(user.getEmail());
    // if (!emailDoesExist.isPresent())
    // return ResponseEntity.notFound().build();

    // Optional<UserEntity> phoneDoesExist =
    // authService.getByPhone(user.getPhone());
    // if (!phoneDoesExist.isPresent())
    // return ResponseEntity.notFound().build();

    // // Do login here

    // //
    // return ResponseEntity.ok();
    // } catch (Exception e) {
    // System.err.println("Internal Server Error: " + e.getMessage());
    // return ResponseEntity.internalServerError().build();
    // }
    // }
}
