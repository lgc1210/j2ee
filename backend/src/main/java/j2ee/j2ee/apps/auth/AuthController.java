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

import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserService;
import j2ee.j2ee.utils.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        try {
            if (authRequest.getEmail() == null || authRequest.getPassword() == null)
                return ResponseEntity.badRequest().build();

            Optional<UserEntity> user = userService.getByEmail(authRequest.getEmail());
            if (!user.isPresent())
                return ResponseEntity.notFound().build();

            if (!passwordEncoder.matches(authRequest.getPassword(), user.get().getPassword()))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            System.out.println(passwordEncoder.matches(authRequest.getPassword(), user.get().getPassword()));

            String token = JwtUtil.generateToken(user.get().getEmail(), user.get().getRole().getId());
            AuthResponse authResponse = new AuthResponse(token);

            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
