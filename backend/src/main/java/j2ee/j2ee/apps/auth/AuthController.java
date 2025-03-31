package j2ee.j2ee.apps.auth;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import j2ee.j2ee.apps.user.UserController;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserService;
import j2ee.j2ee.utils.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserController userController;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(UserService userService, PasswordEncoder passwordEncoder, UserController userController,
            JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.userController = userController;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<UserEntity> register(@RequestBody UserEntity userEntity) {
        return userController.create(userEntity);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest credentials) {
        try {
            if (credentials.getEmail() == null || credentials.getPassword() == null) {
                return ResponseEntity.badRequest().build();
            }

            Optional<UserEntity> user = userService.getByEmail(credentials.getEmail());
            if (!user.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            if (!passwordEncoder.matches(credentials.getPassword(), user.get().getPassword())) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String token = jwtUtil.generateToken(user);
            LoginResponse response = new LoginResponse(token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            return ResponseEntity.ok("Logg out successfully");
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
