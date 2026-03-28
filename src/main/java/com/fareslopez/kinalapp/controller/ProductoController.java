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

    @GetMapping
    public List<Producto> listar() {
        return productoService.listarTodos();
    }
    @PostMapping
    public Producto guardar(@RequestBody Producto producto){
        return productoService.guardar(producto);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(@PathVariable int id){
        return productoService.buscarPorId(id)
                .map(producto -> ResponseEntity.ok(producto))
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable int id, @RequestBody Producto producto){
        if (!productoService.existePorId(id)){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productoService.actualizar(id, producto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id){
        if (!productoService.existePorId(id)){
            return ResponseEntity.notFound().build();
        }
        productoService.eliminar(id);
        return ResponseEntity.ok().build();
    }

}