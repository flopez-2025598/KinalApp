package com.fareslopez.kinalapp.controller;

import com.fareslopez.kinalapp.entity.Usuario;
import com.fareslopez.kinalapp.service.IUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private IUsuarioService usuarioService;

    /*
     * NO se inyecta PasswordEncoder aquí.
     * UsuarioService.guardar() y UsuarioService.actualizar()
     * ya se encargan de encriptar con BCrypt exactamente una vez.
     * Hacerlo aquí también causaría doble encriptado:
     *   BCrypt( BCrypt(password) ) → login SIEMPRE falla.
     */

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

    /* ── POST /usuarios ── crear ──
     * La contraseña llega en texto plano desde el frontend.
     * UsuarioService.guardar() la encripta antes de persistir. */
    @PostMapping
    public Usuario guardar(@RequestBody Usuario usuario) {
        return usuarioService.guardar(usuario);
    }

    /* ── PUT /usuarios/{id} ── actualizar ──
     * Si la contraseña llega vacía o ya es un hash BCrypt ($2a$),
     * UsuarioService.actualizar() la conserva sin re-encriptar. */
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable int id,
                                              @RequestBody Usuario usuario) {
        if (!usuarioService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }
        usuario.setCodigoUsuario(id);
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