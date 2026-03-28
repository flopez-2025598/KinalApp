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

    @GetMapping
    public List<DetalleVenta> listar() {
        return detalleVentaService.listarTodos();
    }
    @PostMapping
    public DetalleVenta guardar(@RequestBody DetalleVenta detalleVenta){
        return detalleVentaService.guardar(detalleVenta);
    }
    @GetMapping("/{id}")
    public ResponseEntity<DetalleVenta> buscarPorId(@PathVariable int id){
        return detalleVentaService.buscarPorId(id)
                .map(detalleVenta -> ResponseEntity.ok(detalleVenta))
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<DetalleVenta> actualizar(@PathVariable int id, @RequestBody DetalleVenta detalleVenta){
        if (!detalleVentaService.existePorId(id)){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detalleVentaService.actualizar(id, detalleVenta));
    }

}