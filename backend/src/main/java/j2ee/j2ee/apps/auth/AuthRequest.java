package j2ee.j2ee.apps.auth;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
