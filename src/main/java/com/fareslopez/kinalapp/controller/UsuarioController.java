package com.fareslopez.kinalapp.controller;

import com.fareslopez.kinalapp.entity.Usuario;
import com.fareslopez.kinalapp.service.IUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private IUsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /* ── GET /usuarios ── listar todos ── */
    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listarTodos();
    }

    /* ── GET /usuarios/{id} ── buscar por ID ── */
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable int id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* ── POST /usuarios ── crear ── */
    @PostMapping
    public Usuario guardar(@RequestBody Usuario usuario) {
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        return usuarioService.guardar(usuario);
    }

    /* ── PUT /usuarios/{id} ── actualizar ── */
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable int id,
                                              @RequestBody Usuario usuario) {
        if (!usuarioService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }
        usuario.setCodigoUsuario(id);
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        return ResponseEntity.ok(usuarioService.actualizar(id, usuario));
    }

    /* ── DELETE /usuarios/{id} ── eliminar ── */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!usuarioService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}