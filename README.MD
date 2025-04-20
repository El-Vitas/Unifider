## Comandos Disponibles

El proyecto incluye un `Makefile` que simplifica la gestión de los contenedores Docker. Asegúrate de tener Docker y Make instalados en tu sistema.

- **Iniciar los contenedores:**

  ```bash
  make run
  ```

  Este comando construirá y levantará los contenedores definidos en tu archivo `docker-compose.yml`.

- **Detener los contenedores:**

  ```bash
  make stop
  ```

  Este comando detendrá los contenedores en ejecución.

## Cuentas de Usuario para Prueba

Puedes utilizar las siguientes credenciales para iniciar sesión en la aplicación:

- **Administrador:**
  - **Correo electrónico:** `admin@admin.cl`
  - **Contraseña:** `admin123`

- **Usuario estándar:**
  - **Correo electrónico:** `test@test.cl`
  - **Contraseña:** `12345678`

## Acceso a la Aplicación Web

Una vez que los contenedores estén en ejecución, puedes acceder a la aplicación web desde tu navegador en la siguiente dirección:

[http://localhost:5173/](http://localhost:5173/)
