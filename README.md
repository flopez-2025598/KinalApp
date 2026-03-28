# KinalApp

KinalApp es una API REST que desarrollé con Spring Boot para gestionar un sistema de ventas. Permite administrar clientes, usuarios, productos, ventas y detalles de venta.

## Tecnologías Utilizadas

* **Java 21**
* **Spring Boot 4.0.2**
* **Maven**
* **MySQL**
* **Hibernate/JPA**

## Requisitos Previos

* **JDK 21** o superior instalado
* **Maven** instalado
* **MySQL** activo
* **Postman** para probar los endpoints

## Instalación y Ejecución

1. Clona el repositorio:
```bash
git clone https://github.com/flopez-2025598/KinalApp.git
```

2. Ejecuta el script SQL ubicado en `src/SQL/KinalApp.sql`

3. Configura tus credenciales en `application.properties`:
```properties
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_PASSWORD
```

4. Corre el proyecto desde IntelliJ con el botón ▶️

## Endpoints

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /clientes | Listar clientes |
| POST | /clientes | Crear cliente |
| GET | /usuarios | Listar usuarios |
| POST | /usuarios | Crear usuario |
| GET | /productos | Listar productos |
| POST | /productos | Crear producto |
| GET | /ventas | Listar ventas |
| POST | /ventas | Crear venta |
| GET | /detalleventas | Listar detalles |
| POST | /detalleventas | Crear detalle |

## Autor

**Fares Lopez** - 2025598