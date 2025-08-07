### Decisión de Diseño: Gestión de Permisos

En el backend, se optó por implementar **RBAC (Control de Acceso Basado en Roles)** para gestionar los permisos y roles.

Se evaluó la alternativa de usar ABAC (Control de Acceso Basado en Atributos), pero finalmente se decidió por RBAC por la naturaleza del proyecto. No se requieren _tenants_ ni permisos granulares que restrinjan el acceso de un usuario solo a los recursos que él mismo ha creado. El proyecto cuenta con un modelo de acceso más sencillo: la mayoría de los usuarios puede acceder a todos los recursos, y existe un único rol de administrador con permisos especiales. Dada esta simplicidad, implementar ABAC habría sido excesivo.

### Implementación Personalizada de RBAC

La implementación de RBAC se diferencia de la sugerida en la documentación de NestJS ([enlace a la documentación](https://docs.nestjs.com/security/authorization#basic-rbac-implementation)) para mejorar la escalabilidad y la eficiencia.

La implementación estándar de NestJS asigna roles directamente a cada API. Aunque esto funciona para proyectos pequeños, se vuelve poco escalable a medida que se añaden nuevos roles. En ese escenario, sería necesario modificar manualmente cada _endpoint_ de la API para agregar o eliminar roles, lo que resulta en un trabajo repetitivo e ineficiente.

Para solventar esto, se adoptó un enfoque más flexible:

1.  **Permisos específicos por API:** Cada API tiene asignados permisos específicos, como `read-post`, `update-post`, `delete-post`, `read-gym`, etc.
2.  **Roles con permisos:** Cada rol (ej. `user`, `admin`) tiene un conjunto de permisos asociados.
3.  **Verificación de permisos:** Cuando un usuario intenta acceder a una API, el sistema verifica si el usuario, a través de su rol, posee todos los permisos necesarios para realizar la acción.

De esta forma, al **agregar un nuevo rol**, solo es necesario definirlo y asociarle los permisos correspondientes, sin necesidad de modificar el código de cada API. Esto hace que el sistema sea mucho más **escalable y fácil de mantener** a largo plazo.

Como excepción a esta regla, se mantuvo la opción de **asignar roles directamente a la API**. Esto se aplica en situaciones específicas donde una API cumple con los permisos requeridos tanto para un usuario normal como para un admin, pero su uso debe estar restringido exclusivamente al rol de admin. Este escenario es la **excepción, no la regla**, y su implementación es opcional.