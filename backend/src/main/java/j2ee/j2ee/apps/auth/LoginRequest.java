package j2ee.j2ee.apps.auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
