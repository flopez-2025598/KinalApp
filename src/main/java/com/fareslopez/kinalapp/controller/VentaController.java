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

    @GetMapping
    public List<Venta> listar() {
        return ventaService.listarTodos();
    }
    @PostMapping
    public Venta guardar(@RequestBody Venta venta){
        return ventaService.guardar(venta);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Venta> buscarPorId(@PathVariable int id){
        return ventaService.buscarPorId(id)
                .map(venta -> ResponseEntity.ok(venta))
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Venta> actualizar(@PathVariable int id, @RequestBody Venta venta){
        if (!ventaService.existePorId(id)){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ventaService.actualizar(id, venta));
    }

}