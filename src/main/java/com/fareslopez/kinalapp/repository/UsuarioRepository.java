package com.fareslopez.kinalapp.repository;

import com.fareslopez.kinalapp.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    /**
     * Busca un usuario por su username (campo "usuario" en la entidad,
     * columna "username" en la BD).
     * Spring Security lo necesita en UserDetailsServiceImpl.
     */
    Optional<Usuario> findByUsuario(String usuario);
}