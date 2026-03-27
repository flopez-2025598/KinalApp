package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.DetalleVenta;
import java.util.List;
import java.util.Optional;

public interface IDetalleVentaService {
    List<DetalleVenta> listarTodos();
    DetalleVenta guardar(DetalleVenta detalleVenta);
    Optional<DetalleVenta> buscarPorId(int id);
    DetalleVenta actualizar(int id, DetalleVenta detalleVenta);
    void eliminar(int id);
    boolean existePorId(int id);
}