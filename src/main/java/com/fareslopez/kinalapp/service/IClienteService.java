package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Cliente;
import java.util.List;
import java.util.Optional;

public interface IClienteService {
    List<Cliente> listarTodos();
    Cliente guardar(Cliente cliente);
    Optional<Cliente> buscarPorDpi(int dpi);
    Cliente actualizar(int dpi, Cliente cliente);
    void eliminar(int dpi);
    boolean existeporDPI(int dpi);
}