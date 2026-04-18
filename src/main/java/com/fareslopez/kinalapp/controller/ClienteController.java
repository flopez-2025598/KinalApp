package com.fareslopez.kinalapp.controller;

import com.fareslopez.kinalapp.entity.Cliente;
import com.fareslopez.kinalapp.repository.ClienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteRepository repo;

    public ClienteController(ClienteRepository repo) {
        this.repo = repo;
    }

    /* ── GET /clientes ── listar todos ── */
    @GetMapping
    public List<Cliente> listar() {
        return repo.findAll();
    }

    /* ── GET /clientes/{dpi} ── buscar por ID (llave primaria) ── */
    @GetMapping("/{dpi}")
    public ResponseEntity<Cliente> buscarPorDpi(@PathVariable int dpi) {
        return repo.findById(dpi)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* ── POST /clientes ── crear ── */
    @PostMapping
    public Cliente guardar(@RequestBody Cliente c) {
        return repo.save(c);
    }

    /**
     * PUT /clientes/{dpi} — actualizar cliente.
     *
     * RESTRICCIÓN DE INTEGRIDAD:
     * El campo dpiCliente es la LLAVE PRIMARIA de Cliente.
     * La tabla Ventas lo referencia como LLAVE FORÁNEA (Clientes_dpi_cliente).
     * Por eso el PUT fuerza el DPI desde el {path}, ignorando cualquier valor
     * que el cliente JSON pudiera traer — garantizando que la PK nunca cambia.
     *
     * Campos actualizables: nombreCliente, apellidoCliente, direccion, estado.
     */
    @PutMapping("/{dpi}")
    public ResponseEntity<Cliente> actualizar(@PathVariable int dpi,
                                              @RequestBody Cliente cliente) {
        if (!repo.existsById(dpi)) {
            return ResponseEntity.notFound().build();
        }
        // Forzar la PK desde el path — nunca se deja modificar
        cliente.setDpiCliente(dpi);
        return ResponseEntity.ok(repo.save(cliente));
    }

    /* ── DELETE /clientes/{dpi} ── eliminar ── */
    @DeleteMapping("/{dpi}")
    public ResponseEntity<Void> eliminar(@PathVariable int dpi) {
        if (!repo.existsById(dpi)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(dpi);
        return ResponseEntity.ok().build();
    }
}