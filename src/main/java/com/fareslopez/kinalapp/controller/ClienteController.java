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

    public ClienteController(ClienteRepository repo){
        this.repo = repo;
    }

    @GetMapping
    public List<Cliente> listar(){
        return repo.findAll();
    }

    @PostMapping
    public Cliente guardar(@RequestBody Cliente c){
        return repo.save(c);
    }

    @PutMapping("/{dpi}")
    public ResponseEntity<Cliente> actualizar(@PathVariable String dpi, @RequestBody Cliente cliente){
        if (!repo.existsById(dpi)){
            return ResponseEntity.notFound().build();
        }
        cliente.setDPICliente(dpi);
        return ResponseEntity.ok(repo.save(cliente));
    }

    @GetMapping("/{dpi}")
    public ResponseEntity<Cliente> buscarPorDpi(@PathVariable String dpi){
        return repo.findById(dpi)
                .map(cliente -> ResponseEntity.ok(cliente))
                .orElse(ResponseEntity.notFound().build());
    }
}