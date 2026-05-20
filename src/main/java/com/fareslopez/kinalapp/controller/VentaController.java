package com.fareslopez.kinalapp.controller;

import com.fareslopez.kinalapp.entity.Venta;
import com.fareslopez.kinalapp.service.IVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ventas")
public class VentaController {

    @Autowired
    private IVentaService ventaService;

    /* ── GET /ventas ── listar todas ── */
    @GetMapping
    public List<Venta> listar() {
        return ventaService.listarTodos();
    }

    /* ── GET /ventas/{id} ── buscar por ID (llave primaria) ── */
    @GetMapping("/{id}")
    public ResponseEntity<Venta> buscarPorId(@PathVariable int id) {
        return ventaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* ── POST /ventas ── crear ── */
    @PostMapping
    public Venta guardar(@RequestBody Venta venta) {
        return ventaService.guardar(venta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venta> actualizar(@PathVariable int id,
                                            @RequestBody Venta venta) {
        if (!ventaService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        // Obtener la venta actual para preservar las llaves foráneas
        Venta ventaActual = ventaService.buscarPorId(id).orElseThrow();

        // Forzar PK desde el path
        venta.setCodigoVenta(id);

        // Preservar las FKs del registro original — nunca se modifican
        venta.setClientesDpiCliente(ventaActual.getClientesDpiCliente());
        venta.setUsuariosCodigoUsuario(ventaActual.getUsuariosCodigoUsuario());

        return ResponseEntity.ok(ventaService.actualizar(id, venta));
    }

    /* ── DELETE /ventas/{id} ── eliminar ── */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!ventaService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }
        ventaService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}