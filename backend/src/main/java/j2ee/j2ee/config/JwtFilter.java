package j2ee.j2ee.config;

import java.io.IOException;
import org.springframework.web.filter.OncePerRequestFilter;
import j2ee.j2ee.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Skip filter for /login
        if (request.getRequestURI().equals("/api/auth/login")
                || request.getRequestURI().equals("/api/auth/logout")
                || request.getRequestURI().equals("/api/auth/register")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Look for token in header
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Get token (Skip Bearer)
        try {
            // Extract the token after "Bearer "
            String token = header.substring(7);
            if (JwtUtil.validateToken(token)) {
                // Proceed if valid
                filterChain.doFilter(request, response);
            } else {
                // Reject if invalid
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token format");
        }
    }
}
