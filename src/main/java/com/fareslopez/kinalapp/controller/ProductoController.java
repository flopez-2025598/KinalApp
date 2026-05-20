package com.fareslopez.kinalapp.controller;

import com.fareslopez.kinalapp.entity.Producto;
import com.fareslopez.kinalapp.service.IProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private IProductoService productoService;

    /* ── GET /productos ── listar todos ── */
    @GetMapping
    public List<Producto> listar() {
        return productoService.listarTodos();
    }

    /* ── GET /productos/{id} ── buscar por ID (llave primaria) ── */
    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(@PathVariable int id) {
        return productoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* ── POST /productos ── crear ── */
    @PostMapping
    public Producto guardar(@RequestBody Producto producto) {
        return productoService.guardar(producto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable int id,
                                               @RequestBody Producto producto) {
        if (!productoService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }
        // Forzar la PK desde el path — nunca se deja modificar
        producto.setCodigoProducto(id);
        return ResponseEntity.ok(productoService.actualizar(id, producto));
    }

    /* ── DELETE /productos/{id} ── eliminar ── */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!productoService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }
        productoService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}