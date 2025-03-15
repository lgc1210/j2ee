package j2ee.j2ee.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
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

    public static String generateToken(String email, String role) {
        return Jwts
                .builder()
                .setSubject(email)
                .claim("role", role)
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
