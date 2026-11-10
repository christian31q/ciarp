# Correcciones para Figma Make

Aplica las siguientes correcciones directamente sobre el prototipo existente. **No rediseñes la plataforma desde cero**: conserva la identidad visual, estructura general, componentes y estilo actuales, pero modifica los flujos, campos y funcionalidades según estas reglas.

## 1. Unificar "Inicio" y "Valoraciones"

- Eliminar la duplicidad de información entre las secciones **"Inicio"** y **"Valoraciones"**.
- Toda la información y funcionalidades relacionadas con las valoraciones deben quedar centralizadas en **"Inicio"**.
- La sección **"Valoraciones"** debe eliminarse del menú o dejar de existir como sección independiente.
- "Inicio" debe convertirse en el centro principal de gestión de valoraciones.
- Incorporar filtros en "Inicio" para facilitar la consulta y gestión de los registros.
- Los filtros deben permitir, como mínimo:
  - Docente
  - Tipo de contratación
  - Sede
  - Fecha de creación
  - Estado del proceso
  - Resultado/puntaje
- Mantener las funcionalidades que anteriormente estaban disponibles en "Valoraciones", trasladándolas a "Inicio".
- Actualizar navegación, botones, breadcrumbs y demás elementos para que no existan referencias a una sección independiente llamada "Valoraciones".

## 2. Cálculo de puntos durante la digitación

Modificar completamente el comportamiento del sistema de puntuación.

**Los puntos NO deben calcularse únicamente al finalizar el workflow.**

Cada vez que el usuario digite o modifique un dato que tenga impacto en la valoración:

1. El sistema debe identificar inmediatamente el valor correspondiente.
2. Debe calcular los puntos asociados a ese dato.
3. Debe actualizar el subtotal correspondiente.
4. Debe actualizar el puntaje acumulado.
5. El puntaje actualizado debe permanecer visible durante el proceso.

Ejemplo de comportamiento:

```text
Usuario ingresa un dato
        ↓
El sistema identifica el criterio
        ↓
Calcula los puntos
        ↓
Actualiza subtotal
        ↓
Actualiza puntaje total
        ↓
El usuario continúa digitando
```

El workflow final debe mostrar **todos los datos ingresados y todos los puntos acumulados y actualizados**, pero no debe ser el primer momento en que se realiza el cálculo.

Si el usuario modifica o elimina un dato, los puntos asociados también deben recalcularse inmediatamente.

## 3. Visualización del puntaje

En los formularios de digitación y valoración:

- Mostrar el puntaje correspondiente al criterio después de ingresar el dato.
- Mostrar subtotales por categoría cuando corresponda.
- Mostrar un **puntaje total acumulado** siempre actualizado.
- Al avanzar entre pasos del workflow, conservar los puntos previamente calculados.
- Al regresar a un paso anterior y modificar información, recalcular automáticamente los puntos.
- El resumen final debe utilizar los mismos valores calculados durante la digitación, evitando inconsistencias entre el formulario y el resultado final.

## 4. Eliminar soportes y validación documental

Eliminar del prototipo cualquier funcionalidad relacionada con la presentación, carga o validación de documentos probatorios.

**No se deben solicitar documentos de soporte para acreditar la experiencia.**

Eliminar:

- Carga de documentos.
- Botones para adjuntar soportes.
- Campos de documentos probatorios.
- Validación de documentos.
- Estados relacionados con documentos pendientes.
- Mensajes solicitando evidencias.
- Secciones de "Soportes".
- Secciones de "Validación documental".
- Cualquier paso del workflow cuyo único propósito sea comprobar documentalmente la experiencia.

La experiencia debe registrarse directamente mediante los datos digitados en el formulario y generar los puntos correspondientes según las reglas de valoración.

## 5. Agregar sede del profesor

Agregar el campo **"Sede"** al registro del docente.

Debe ser un selector con únicamente estas opciones:

- **Sede Calle 100**
- **Sede Cajicá**

La sede debe aparecer:

- En el formulario de creación/registro del docente.
- En la información del docente.
- En las valoraciones.
- En el resumen final.
- En los filtros de "Inicio".

El valor seleccionado debe mantenerse durante todo el workflow.

## 6. Tipo de contratación docente

Modificar las opciones de contratación.

Los docentes **solo pueden ser contratados como docentes de planta**.

El campo debe tener como categoría principal:

**Tipo de vinculación:**
- Docente de planta

Para la dedicación, permitir únicamente:

- **Tiempo completo**
- **Medio tiempo**

Eliminar cualquier otra opción de contratación o vinculación que exista actualmente, incluyendo opciones como docente ocasional, cátedra, prestación de servicios u otras modalidades.

La interfaz no debe mostrar opciones inválidas.

## 7. Fecha de creación del reporte

La **fecha de creación del reporte no debe ser editable por el usuario**.

Cuando se cree un nuevo reporte:

- El sistema debe tomar automáticamente la fecha del calendario en el momento de creación.
- La fecha debe quedar registrada automáticamente.
- El usuario no debe poder modificarla mediante un campo de texto, selector o calendario.
- Mostrarla como un dato informativo de solo lectura.
- La fecha debe permanecer asociada al reporte durante todo el workflow.

Ejemplo:

```text
Fecha de creación
16/08/2026

Generada automáticamente al crear el reporte.
No editable.
```

No incluir un date picker para este campo.

## 8. Formato obligatorio para todas las fechas

Todas las fechas visibles en la plataforma deben utilizar exclusivamente el formato:

**DD/MM/AAAA**

Ejemplos:

- `16/08/2026`
- `05/03/2026`
- `21/11/2025`

Aplicar este formato a:

- Fecha de creación.
- Fechas de experiencia.
- Fechas de contratación.
- Fechas de finalización.
- Fechas mostradas en tablas.
- Fechas mostradas en tarjetas.
- Fechas del historial.
- Fechas del resumen.
- Fechas utilizadas en filtros.
- Cualquier otra fecha presente en el prototipo.

No utilizar formatos como:

- `2026-08-16`
- `08/16/2026`
- `16 Aug 2026`
- `Aug 16, 2026`

## 9. Workflow actualizado

El flujo general debe funcionar de esta manera:

```text
Inicio
  ↓
Crear / seleccionar reporte
  ↓
Datos del docente
  ├── Información personal
  ├── Sede
  └── Tipo de vinculación
       └── Docente de planta
           ├── Tiempo completo
           └── Medio tiempo
  ↓
Digitación de información
  ↓
Cálculo automático de puntos
  ↓
Actualización de subtotales y total
  ↓
Revisión de información
  ↓
Resumen final
  ↓
Todos los datos + todos los puntos actualizados
```

No incluir un paso de carga o validación documental.

## 10. Reglas de interacción

Asegurar que:

- Los datos ingresados se conserven al navegar entre pasos.
- Los puntos se actualicen inmediatamente después de cada modificación relevante.
- El puntaje total nunca quede desactualizado.
- Los datos modificados en pasos anteriores actualicen automáticamente el resumen.
- Los datos eliminados de un criterio también eliminen sus puntos asociados.
- El resumen final sea consistente con la información digitada.
- La fecha de creación permanezca fija.
- La sede seleccionada permanezca almacenada.
- El tipo de vinculación solo permita las opciones válidas.
- No aparezcan controles relacionados con documentos probatorios.

## 11. Inicio como pantalla principal

La pantalla **Inicio** debe concentrar la gestión completa.

Debe incluir:

- Resumen general.
- Listado de reportes/valoraciones.
- Búsqueda.
- Filtros.
- Estado de cada proceso.
- Docente.
- Sede.
- Fecha de creación.
- Puntaje.
- Acciones disponibles para cada registro.

La interfaz debe permitir acceder desde Inicio al detalle de un reporte y continuar con su workflow sin necesidad de navegar a una sección llamada "Valoraciones".

## 12. Consistencia del prototipo

Después de realizar los cambios:

- Revisar todos los textos.
- Revisar navegación.
- Revisar botones.
- Revisar formularios.
- Revisar tablas.
- Revisar tarjetas.
- Revisar filtros.
- Revisar estados.
- Revisar modales.
- Revisar el workflow completo.

Eliminar cualquier referencia residual a funcionalidades que ya no existen.

**Objetivo final:** el prototipo debe representar un sistema donde toda la gestión de valoración está centralizada en **Inicio**, los puntos se calculan **en tiempo real desde la digitación de los datos**, no existen soportes documentales, el docente tiene una sede definida y únicamente puede ser **docente de planta — tiempo completo o medio tiempo**, la fecha de creación es automática y no editable, y todas las fechas utilizan **DD/MM/AAAA**.