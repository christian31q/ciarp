# Correcciones adicionales para Figma Make

Aplica las siguientes modificaciones **sobre el prototipo existente**, manteniendo la identidad visual, componentes, estilos y estructura general actuales. No crear una plataforma nueva ni modificar funcionalidades que no estén relacionadas con estas correcciones.

## 1. Nueva valoración — Tipo de artículo

En la sección **"Nueva valoración"**, ubicar el campo **"Tipo de artículo"**.

El campo debe tener **una única opción disponible**:

- **Artículo completo**

Eliminar cualquier otra opción que exista actualmente.

El selector no debe permitir seleccionar otros tipos de artículo.

### Comportamiento esperado

```text
Tipo de artículo
[ Artículo completo ▼ ]
```

No agregar opciones adicionales.

---

## 2. Nueva valoración — Fecha de publicación obligatoria

En la sección **"Nueva valoración"**, la **fecha de publicación del artículo debe ser obligatoria**.

El usuario no debe poder continuar con el registro del artículo si la fecha de publicación está vacía.

### Reglas

- Marcar el campo como obligatorio.
- Permitir seleccionar/ingresar la fecha de publicación.
- Utilizar el formato obligatorio de fechas de toda la plataforma: **DD/MM/AAAA**.
- Si el usuario intenta continuar sin ingresar la fecha, mostrar un mensaje de validación claro.
- No permitir avanzar al siguiente paso hasta que la fecha haya sido ingresada.

Ejemplo:

```text
Fecha de publicación *
[ DD/MM/AAAA ]

⚠ La fecha de publicación es obligatoria para continuar.
```

Una vez ingresada correctamente, el usuario puede continuar con el artículo.

---

## 3. Nueva valoración — Eliminar ISSN

En la sección **"Nueva valoración"**, eliminar el campo **"ISSN"**.

El ISSN **no debe ser solicitado, registrado ni validado** dentro de este flujo.

Eliminar también:

- Etiqueta ISSN.
- Campo de entrada.
- Validaciones asociadas.
- Mensajes de error relacionados con ISSN.
- Indicadores de campo obligatorio relacionados con ISSN.

No reemplazarlo por otro campo.

---

## 4. Exportar datos — Docentes con proceso completado

Modificar la sección **"Exportar datos"** para que permita consultar los docentes cuyo proceso de valoración ya está **completado**.

La sección debe mostrar los docentes que hayan terminado completamente su proceso de valoración.

Para cada docente completado mostrar información suficiente para identificar el expediente, por ejemplo:

- Nombre del docente.
- Identificación o código correspondiente, si ya existe en el prototipo.
- Sede.
- Tipo de vinculación.
- Dedicación.
- Fecha de creación del reporte.
- Estado: **Completado**.
- Puntaje total.
- Tiempo completo del proceso, cuando este dato esté disponible en el prototipo.

Mantener el formato de todas las fechas como **DD/MM/AAAA**.

---

## 5. Descargar Expediente

Dentro de **"Exportar datos"**, implementar funcionalmente la opción:

**"Descargar Expediente"**

Actualmente existe un botón con este nombre pero **no tiene funcionalidad**. Ahora debe funcionar como una acción real del prototipo.

### Comportamiento

Al seleccionar **"Descargar Expediente"** sobre un docente con proceso completado:

1. Tomar toda la información registrada del docente.
2. Tomar toda la información de la valoración.
3. Tomar todos los puntajes calculados.
4. Tomar los subtotales y puntaje total.
5. Tomar los tiempos completos registrados en el proceso.
6. Generar un expediente en **PDF**.
7. Permitir al usuario descargar/visualizar el PDF generado.

El expediente debe contener toda la información relevante del docente y su valoración.

### Contenido mínimo del expediente

```text
EXPEDIENTE DE VALORACIÓN DOCENTE

Información del docente
- Nombre
- Identificación
- Sede
- Tipo de vinculación
- Dedicación

Información del reporte
- Fecha de creación
- Estado del proceso
- Fecha de finalización, si existe

Valoración
- Información registrada
- Criterios evaluados
- Datos digitados
- Puntos obtenidos por cada criterio
- Subtotales
- Puntaje total

Tiempos del proceso
- Tiempos registrados disponibles en el sistema
- Duración total del proceso, si está disponible

Resultado final
- Puntaje total
- Estado: Completado
```

No solicitar nuevamente información al usuario para generar el expediente.

El PDF debe utilizar la información almacenada en el registro completado.

---

## 6. Nueva valoración > Experiencia calificada > Dedicación

Modificar el campo **"Dedicación"** dentro de:

**Nueva valoración → Experiencia calificada → Dedicación**

Actualmente debe actualizarse para permitir únicamente estas dos opciones:

- **Tiempo parcial**
- **Tiempo completo**

Eliminar cualquier otra opción.

El selector debe quedar:

```text
Dedicación *
[ Seleccionar dedicación ▼ ]

Opciones:
- Tiempo parcial
- Tiempo completo
```

La selección debe conservarse correctamente durante todo el workflow y reflejarse en el resumen final y en el expediente PDF.

---

## 7. Confirmación al editar

Los eventos de **editar** deben incluir una confirmación antes de aplicar cambios que puedan modificar información o puntajes.

Cuando el usuario seleccione **"Editar"**, mostrar un mensaje de confirmación claro.

Ejemplo:

```text
¿Deseas editar esta información?

Los cambios realizados pueden modificar el puntaje de la valoración.

[Cancelar]    [Continuar editando]
```

### Reglas

- **Cancelar**: cerrar el mensaje y conservar la información sin cambios.
- **Continuar editando**: permitir modificar la información.
- Una vez modificada la información, recalcular automáticamente los puntos afectados.
- Actualizar el puntaje total inmediatamente después de la modificación.

---

## 8. Confirmación al eliminar

Los eventos de **eliminar** deben solicitar confirmación antes de ejecutar la acción.

Mostrar un mensaje de confirmación antes de eliminar cualquier registro o información.

Ejemplo:

```text
¿Estás seguro de que deseas eliminar este registro?

Esta acción eliminará la información seleccionada y puede afectar
el puntaje de la valoración.

[Cancelar]    [Eliminar]
```

### Reglas

- **Cancelar**: cerrar el mensaje sin eliminar nada.
- **Eliminar**: ejecutar la eliminación.
- Después de eliminar, recalcular inmediatamente los puntos correspondientes.
- Actualizar subtotales y puntaje total.
- Actualizar cualquier resumen relacionado.
- Mostrar una confirmación visual de que la eliminación fue realizada.

No eliminar información directamente al presionar el botón **"Eliminar"** sin mostrar primero la confirmación.

---

## 9. Consistencia con las correcciones anteriores

Mantener las reglas ya establecidas en el prototipo:

- Toda la gestión de valoraciones permanece centralizada en **"Inicio"**.
- Los puntos se calculan **desde la digitación de los datos**.
- Los puntos deben actualizarse inmediatamente cuando se agregan, modifican o eliminan datos.
- No solicitar soportes ni documentos probatorios.
- Las sedes disponibles son:
  - **Sede Calle 100**
  - **Sede Cajicá**
- Los docentes solo pueden ser:
  - **Docente de planta — Tiempo completo**
  - **Docente de planta — Medio tiempo**
- La fecha de creación del reporte es automática y **no editable**.
- Todas las fechas de la plataforma deben utilizar el formato **DD/MM/AAAA**.

## 10. Revisión final

Después de implementar los cambios, revisar el prototipo completo para asegurar que:

- "Tipo de artículo" solo tenga **Artículo completo**.
- La fecha de publicación sea obligatoria.
- ISSN no aparezca en Nueva valoración.
- "Descargar Expediente" funcione para docentes con proceso completado.
- El expediente PDF contenga la información completa disponible del docente, valoración, puntajes y tiempos.
- "Dedicación" permita únicamente **Tiempo parcial** y **Tiempo completo**.
- Editar siempre solicite confirmación.
- Eliminar siempre solicite confirmación.
- Las modificaciones y eliminaciones actualicen automáticamente los puntajes.
- No existan campos, opciones o validaciones residuales correspondientes a funcionalidades eliminadas.
- Se mantenga la coherencia visual y funcional con el prototipo existente.

**No modificar el diseño visual general del prototipo salvo cuando sea necesario para implementar correctamente estas funcionalidades.**