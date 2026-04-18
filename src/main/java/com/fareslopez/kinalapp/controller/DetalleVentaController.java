package com.fareslopez.kinalapp.controller;

import com.fareslopez.kinalapp.entity.DetalleVenta;
import com.fareslopez.kinalapp.service.IDetalleVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/detalleventas")
public class DetalleVentaController {

    @Autowired
    private IDetalleVentaService detalleVentaService;

    /* ── GET /detalleventas ── listar todos ── */
    @GetMapping
    public List<DetalleVenta> listar() {
        return detalleVentaService.listarTodos();
    }

    /* ── GET /detalleventas/{id} ── buscar por ID (llave primaria) ── */
    @GetMapping("/{id}")
    public ResponseEntity<DetalleVenta> buscarPorId(@PathVariable int id) {
        return detalleVentaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* ── POST /detalleventas ── crear ── */
    @PostMapping
    public DetalleVenta guardar(@RequestBody DetalleVenta detalleVenta) {
        return detalleVentaService.guardar(detalleVenta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetalleVenta> actualizar(@PathVariable int id,
                                                   @RequestBody DetalleVenta detalleVenta) {
        if (!detalleVentaService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        // Obtener el registro actual para preservar las FK
        DetalleVenta actual = detalleVentaService.buscarPorId(id).orElseThrow();

        // Forzar PK desde el path
        detalleVenta.setCodigoDetalleVenta(id);

        // Preservar las FKs del registro original — nunca se modifican
        detalleVenta.setProductoCodigoProducto(actual.getProductoCodigoProducto());
        detalleVenta.setVentasCodigoVenta(actual.getVentasCodigoVenta());

        return ResponseEntity.ok(detalleVentaService.actualizar(id, detalleVenta));
    }

    /* ── DELETE /detalleventas/{id} ── eliminar ── */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!detalleVentaService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }
        detalleVentaService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}