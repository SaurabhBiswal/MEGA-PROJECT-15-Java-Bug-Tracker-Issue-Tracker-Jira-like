package com.zosh.issue_tracker.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtProvider {

    static SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    public static String generateToken(Authentication auth) {
        return generateTokenByEmail(auth.getName(), auth.getAuthorities());
    }

    public static String generateTokenByEmail(String email,
            java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authoritiesCollection) {
        String authorities = "";
        if (authoritiesCollection != null) {
            authorities = authoritiesCollection.stream()
                    .map(ga -> ga.getAuthority())
                    .collect(java.util.stream.Collectors.joining(","));
        }
        String jwt = Jwts.builder().setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 86400000))
                .claim("email", email)
                .claim("authorities", authorities)
                .signWith(key)
                .compact();
        return jwt;
    }

    public static String getEmailFromToken(String jwt) {
        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7); // Remove "Bearer "
        }
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
        String email = String.valueOf(claims.get("email"));
        return email;
    }
}
