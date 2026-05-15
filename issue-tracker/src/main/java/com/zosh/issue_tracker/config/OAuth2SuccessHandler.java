package com.zosh.issue_tracker.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        // For Google OAuth2, authentication.getName() might return the 'sub' (Google
        // ID)
        // We need the actual email for our application logic
        String email = authentication.getName();

        if (authentication.getPrincipal() instanceof org.springframework.security.oauth2.core.user.OAuth2User) {
            org.springframework.security.oauth2.core.user.OAuth2User oAuth2User = (org.springframework.security.oauth2.core.user.OAuth2User) authentication
                    .getPrincipal();
            email = oAuth2User.getAttribute("email");
        }

        // Generate token with email
        String token = JwtProvider.generateTokenByEmail(email, authentication.getAuthorities());

        // Redirect to frontend with token
        String targetUrl = "http://localhost:5173/oauth2/success?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
