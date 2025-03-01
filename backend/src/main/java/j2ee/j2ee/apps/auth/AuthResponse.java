package j2ee.j2ee.apps.auth;

import j2ee.j2ee.apps.user.UserEntity;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;

    public AuthResponse(String token) {
        this.token = token;
    }
}
