package com.fareslopez.kinalapp.security;

import com.fareslopez.kinalapp.entity.Usuario;
import com.fareslopez.kinalapp.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Conecta Spring Security con la tabla Usuarios de la BD.
 * Spring Security llama a loadUserByUsername() al intentar autenticar.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Buscar el usuario por el campo "username" (columna username en BD)
        Usuario usuario = usuarioRepository.findByUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado: " + username));

        // Verificar que la cuenta esté activa
        if (usuario.getEstado() == 0) {
            throw new DisabledException("La cuenta está inactiva: " + username);
        }

        // El rol ya viene como "ADMIN", "VENDEDOR", "BODEGUERO"
        // Spring Security requiere el prefijo "ROLE_"
        String roleConPrefijo = "ROLE_" + usuario.getRol();

        return new org.springframework.security.core.userdetails.User(
                usuario.getUsuario(),           // username
                usuario.getContrasena(),        // password (texto plano por ahora)
                List.of(new SimpleGrantedAuthority(roleConPrefijo))
        );
    }
}