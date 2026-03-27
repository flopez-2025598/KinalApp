// IUsuarioService.java
package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Usuario;
import java.util.List;
import java.util.Optional;

public interface IUsuarioService {
    List<Usuario> listarTodos();
    Usuario guardar(Usuario usuario);
    Optional<Usuario> buscarPorId(int id);
    Usuario actualizar(int id, Usuario usuario);
    void eliminar(int id);
    boolean existePorId(int id);
}