package j2ee.j2ee.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import j2ee.j2ee.apps.user.UserEntity;
import java.util.Date;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private static String secretKey;
    private static long expirationTime;

    // Use constructor injection which is generally preferred over field injection
    public JwtUtil(@Value("${jwt.secret}") String secretKey,
            @Value("${jwt.expiration:3600000}") long expirationTime) {
        JwtUtil.secretKey = secretKey;
        JwtUtil.expirationTime = expirationTime;
    }

    public static String generateToken(Optional<UserEntity> user) {
        return Jwts
                .builder()
                .setSubject(user.get().getEmail())
                .claim("id", user.get().getId())
                .claim("name", user.get().getName())
                .claim("email", user.get().getEmail())
                .claim("phone", user.get().getPhone())
                .claim("role", user.get().getRole().getName())
                .claim("created_at", user.get().getCreated_at().toString())
                .claim("updated_at", user.get().getUpdate_at().toString())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public static boolean validateToken(String token) {
        try {
            Jwts
                    .parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static String getRoleFromToken(String token) {
        try {
            return Jwts
                    .parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .get("role", String.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Unable to extract role from token", e);
        }
    }
}
