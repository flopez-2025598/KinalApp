package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Usuario;
import com.fareslopez.kinalapp.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements IUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;   // BCryptPasswordEncoder del SecurityConfig

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    /**
     * Siempre encripta la contraseña antes de guardar.
     * Así el registro desde el frontend ya guarda el hash BCrypt
     * y Spring Security puede autenticar correctamente.
     */
    @Override
    public Usuario guardar(Usuario usuario) {
        usuario.setRol("CLIENTE");
        usuario.setEstado(1);
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorId(int id) {
        return usuarioRepository.findById(id);
    }

    /**
     * Al actualizar: solo re-encripta si el campo contraseña llegó
     * con un valor nuevo (no vacío y no es ya un hash BCrypt).
     * Esto evita doble-encriptado si el front manda el hash existente.
     */
    @Override
    public Usuario actualizar(int id, Usuario usuario) {
        usuario.setCodigoUsuario(id);

        String pass = usuario.getContrasena();
        if (pass != null && !pass.isBlank() && !pass.startsWith("$2a$")) {
            usuario.setContrasena(passwordEncoder.encode(pass));
        }

        return usuarioRepository.save(usuario);
    }

    @Override
    public void eliminar(int id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public boolean existePorId(int id) {
        return usuarioRepository.existsById(id);
    }
}