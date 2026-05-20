package com.fareslopez.kinalapp.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ManejadorDeAutenticacion implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        boolean isAdmin = false;
        boolean isVendedor = false;
        boolean isCliente = false;

        for (GrantedAuthority authority : authentication.getAuthorities()) {
            String a = authority.getAuthority();
            if ("ROLE_ADMIN".equals(a)) isAdmin = true;
            if ("ROLE_VENDEDOR".equals(a)) isVendedor = true;
            if ("ROLE_CLIENTE".equals(a)) isCliente = true;
        }

        if (isCliente) {
            response.sendRedirect("/productos-view");
        } else if (isAdmin) {
            response.sendRedirect("/clientes-view");
        } else if (isVendedor) {
            response.sendRedirect("/ventas-view");
        } else {
            response.sendRedirect("/login-view");
        }
    }
}