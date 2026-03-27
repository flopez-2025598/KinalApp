package com.fareslopez.kinalapp.service;

import com.fareslopez.kinalapp.entity.Cliente;

import java.util.List;
import com.fareslopez.kinalapp.entity.Cliente;

import java.util.List;
import java.util.Optional;

public interface IClienteService {

    /*
     * Interfaaz: Es un contrato que dice QUE metodos debe tener
     * cualquier servicio de Clientes, No tiene
     * Implementación, solo la definición de los métodos
     */


    //Metodo que devuelve una lista de todos los Clientes
    List<Cliente> listarTodos();
    /*
     * List<Cliente> lo que hace es devolver una lista
     * de objetos de la entidad Clientes
     */

    //Metodo que guarda un Cliente en la BD
    Cliente guardar(Cliente cliente);
    //Parámetros: Recibe un onjeto CLiente con los datos a
    //guardar

    //Optional - Contenedor que puede o no tener valor
    //evita el error de NullPointerException
    Optional<Cliente> buscarPorDpi(String dpi);

    //Método que actualiza un cliente
    Cliente actualizar(String dpi, Cliente cliente);
    /*
     * Parametros - dpi: DPI del cliente a actualizar
     * Cliente cliente: Objeto con los datos nuevos
     * Retorna un objeto de tipo Cliente un actualizado
     */

    /*
     *Metodo de tipo vioid  para elimar a in Cliente
     * void: no retorna ningun valor o dato
     * Elimina un cliente por su dpi
     */
    void eliminar(String dpi);

    //boolean . Retorna true si existe y false si no existe
    boolean existeporDPI (String dpi);

}