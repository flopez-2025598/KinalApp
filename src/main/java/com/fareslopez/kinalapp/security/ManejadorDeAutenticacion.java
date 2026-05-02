package com.fareslopez.kinalapp.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ManejadorDeAutenticacion implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        String rol = authentication.getAuthorities().iterator().next().getAuthority();

        switch (rol) {
            case "ROLE_ADMIN"     -> response.sendRedirect("/clientes-view");
            case "ROLE_VENDEDOR"  -> response.sendRedirect("/clientes-view");
            case "ROLE_BODEGUERO" -> response.sendRedirect("/productos-view");
            default               -> response.sendRedirect("/login-view");
        }
    }
}