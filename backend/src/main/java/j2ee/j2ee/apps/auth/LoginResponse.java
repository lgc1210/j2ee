package j2ee.j2ee.apps.auth;

import lombok.Data;

@Data
public class LoginResponse {

    private String token;

    public LoginResponse(String token) {
        this.token = token;
    }
}
