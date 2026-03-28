package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Cliente;
import com.fareslopez.kinalapp.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService implements IClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public List<Cliente> listarTodos(){
        return clienteRepository.findAll();
    }

    @Override
    public Cliente guardar(Cliente cliente){
        return clienteRepository.save(cliente);
    }

    @Override
    public Optional<Cliente> buscarPorDpi(int dpi){
        return clienteRepository.findById(dpi);
    }

    @Override
    public Cliente actualizar(int dpi, Cliente cliente){
        cliente.setDpiCliente(dpi);
        return clienteRepository.save(cliente);
    }

    @Override
    public void eliminar(int dpi){
        clienteRepository.deleteById(dpi);
    }

    @Override
    public boolean existeporDPI(int dpi){
        return clienteRepository.existsById(dpi);
    }
}