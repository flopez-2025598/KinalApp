package com.fareslopez.kinalapp.security;

import com.fareslopez.kinalapp.entity.Usuario;
import com.fareslopez.kinalapp.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.DisabledException;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado: " + username));

        if (usuario.getEstado() == 0) {
            throw new DisabledException("La cuenta está inactiva: " + username);
        }

        String roleConPrefijo = "ROLE_" + usuario.getRol();

        return new org.springframework.security.core.userdetails.User(
                usuario.getUsuario(),
                usuario.getContrasena(),   // Debe ser hash BCrypt en BD
                List.of(new SimpleGrantedAuthority(roleConPrefijo))
        );
    }
}