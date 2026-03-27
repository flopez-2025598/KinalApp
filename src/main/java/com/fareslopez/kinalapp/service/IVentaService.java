package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Venta;
import java.util.List;
import java.util.Optional;

public interface IVentaService {
    List<Venta> listarTodos();
    Venta guardar(Venta venta);
    Optional<Venta> buscarPorId(int id);
    Venta actualizar(int id, Venta venta);
    void eliminar(int id);
    boolean existePorId(int id);
}