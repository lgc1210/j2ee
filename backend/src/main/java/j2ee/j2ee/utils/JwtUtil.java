package j2ee.j2ee.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import j2ee.j2ee.apps.user.UserEntity;
import java.util.Date;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final String secretKey;
    private final long expirationTime;

    public JwtUtil(@Value("${jwt.secret}") String secretKey,
            @Value("${jwt.expiration:3600000}") long expirationTime) {
        this.secretKey = secretKey;
        this.expirationTime = expirationTime;
    }

    public String generateToken(Optional<UserEntity> user) {
        UserEntity userEntity =
                user.orElseThrow(() -> new IllegalArgumentException("User cannot be null"));
        String roleName = userEntity.getRole().getName();

        return Jwts.builder().setSubject(user.get().getEmail()).claim("id", user.get().getId())
                .claim("role", roleName).setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + this.expirationTime))
                .signWith(SignatureAlgorithm.HS256, this.secretKey).compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(this.secretKey).build().parseClaimsJws(token).getBody();
            return true;
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }

    public String getRoleFromToken(String token) {
        try {
            return Jwts.parser().setSigningKey(this.secretKey).build().parseClaimsJws(token)
                    .getBody().get("role", String.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Unable to extract role from token", e);
        }
    }

    public String getEmailFromToken(String token) {
        try {
            return Jwts.parser().setSigningKey(this.secretKey).build().parseClaimsJws(token)
                    .getBody().getSubject();
        } catch (Exception e) {
            throw new IllegalArgumentException("Unable to extract email from token", e);
        }
    }

    public Long getUserIdFromToken(String token) {
        try {
            return Jwts.parser().setSigningKey(this.secretKey).build().parseClaimsJws(token)
                    .getBody().get("id", Long.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Unable to extract user ID from token", e);
        }
    }

    public Claims getClaims(String token) {
        return Jwts.parser().setSigningKey(this.secretKey).build().parseClaimsJws(token).getBody();
    }
}
