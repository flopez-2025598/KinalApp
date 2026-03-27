package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Producto;
import java.util.List;
import java.util.Optional;

public interface IProductoService {
    List<Producto> listarTodos();
    Producto guardar(Producto producto);
    Optional<Producto> buscarPorId(int id);
    Producto actualizar(int id, Producto producto);
    void eliminar(int id);
    boolean existePorId(int id);
}