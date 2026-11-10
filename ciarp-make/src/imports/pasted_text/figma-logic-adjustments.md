# PROMPT MASTER — AJUSTES DE LÓGICA EN FIGMA MAKE

Trabaja sobre el prototipo existente de **“Registro, validación y valoración” de la Universidad Militar Nueva Granada**.

Tu tarea en esta iteración es **modificar exclusivamente la lógica funcional de la aplicación** conforme a las instrucciones siguientes.

## REGLA PRINCIPAL

NO rediseñes la aplicación.

NO reemplaces el sistema visual existente.

NO cambies:

* paleta de colores;
* tipografía;
* sidebar;
* estructura general;
* navegación principal;
* estilo de cards;
* componentes;
* jerarquía visual;
* nombres existentes;
* flujo general del wizard;
* reglas normativas ya implementadas;
* fórmulas que no estén directamente afectadas por estas instrucciones.

Conserva el diseño actual y realiza únicamente los cambios mínimos de interfaz necesarios para soportar la nueva lógica: botones, campos, dropdowns, estados, mensajes, validaciones y comportamientos condicionales.

La prioridad de esta modificación es:

1. coherencia lógica;
2. prevención de datos imposibles o contradictorios;
3. aplicación correcta de las reglas;
4. claridad para el evaluador;
5. mantener intacta la estética existente.

---

# 1. DASHBOARD DE INICIO — VER EXPEDIENTE Y DESCARGAR PDF

Actualmente, dentro del dashboard de **Inicio**, las valoraciones o expedientes disponen de una acción:

**Ver**

Al pulsar **Ver**, se abre la pestaña, drawer, panel o vista resumida existente con la información principal de ese expediente.

Mantén exactamente ese comportamiento y agrega dentro de esa misma vista una nueva acción:

**Descargar expediente**

## Comportamiento

Al pulsar:

**Descargar expediente**

el sistema debe generar directamente un archivo:

**PDF**

No mostrar selector de formato.

No abrir el modal general de exportación.

No preguntar si se desea Excel, CSV o PDF.

Esta acción corresponde específicamente a la descarga individual resumida del expediente.

## Nombre automático del archivo

El PDF debe recibir automáticamente un nombre siguiendo esta estructura:

`Expediente_[NUMERO-EXPEDIENTE]_[NOMBRE-DOCENTE].pdf`

Ejemplo:

`Expediente_VAL-2026-0001_Laura-Martinez-Gomez.pdf`

Normalizar el nombre para el archivo:

* reemplazar espacios por guiones;
* evitar caracteres inválidos;
* conservar un nombre legible.

No solicitar al usuario que escriba el nombre.

## Contenido del PDF

Por ahora generar una versión RESUMIDA.

Debe contener únicamente información principal suficiente para identificar y comprender la valoración, por ejemplo:

* identidad institucional;
* nombre del sistema;
* número del expediente;
* nombre del docente;
* identificación;
* facultad;
* dedicación;
* fecha de valoración;
* estado;
* puntaje total;
* resumen compacto del puntaje por apartados;
* comentario general final, únicamente si existe.

No incrustar todos los archivos soporte.

No generar un informe de auditoría completo.

No incluir información excesivamente técnica.

No desarrollar todavía un expediente documental exhaustivo.

La finalidad actual es disponer de una descarga individual clara y útil.

---

# 2. PRODUCTIVIDAD ACADÉMICA — ÁMBITO NACIONAL O INTERNACIONAL

Modificar la lógica del apartado:

**Productividad académica**

para incorporar la clasificación por ámbito geográfico ÚNICAMENTE cuando la norma diferencia explícitamente entre impacto, difusión, reconocimiento o alcance:

* nacional;
* internacional.

## Regla de aparición

NO preguntar Nacional / Internacional para todos los productos.

El campo solo debe mostrarse en modalidades donde esa distinción tenga incidencia normativa o de cálculo.

Si para determinada modalidad el Decreto o la regla configurada no distingue entre nacional e internacional:

NO mostrar este campo.

NO solicitar país.

NO inventar una diferencia de puntaje.

## Nuevo campo

Cuando corresponda, mostrar:

**Ámbito del producto ***

Opciones:

* Nacional
* Internacional

Debe ser selección única.

Preferiblemente mediante:

* dropdown;
* segmented control;
* radio group compacto;

utilizando el componente existente que mejor preserve el diseño.

---

# 3. PRODUCTIVIDAD ACADÉMICA — PAÍS PARA PRODUCTOS INTERNACIONALES

Si:

`Ámbito del producto = Internacional`

mostrar dinámicamente un nuevo campo obligatorio:

**País ***

Este campo debe utilizar un dropdown/buscador de países.

No utilizar texto libre cuando sea posible.

No preguntar ciudad.

No preguntar región.

No preguntar continente.

Solo:

**País**

## Condicional

Si:

`Ámbito = Nacional`

el campo País:

* permanece oculto;
* no es obligatorio;
* no participa en validaciones.

Si el usuario primero seleccionó Internacional, eligió un país y posteriormente cambia a Nacional:

* ocultar País;
* limpiar el valor anterior;
* eliminarlo de la evaluación del formulario.

---

# 4. PRODUCTIVIDAD ACADÉMICA — IMPACTO EN EL PUNTAJE

Cuando la normativa establezca diferentes valores o topes por ámbito nacional/internacional, la selección debe afectar automáticamente el cálculo.

Ejemplo conceptual:

`Ámbito = Nacional`
→ utilizar la regla nacional correspondiente.

`Ámbito = Internacional`
→ utilizar la regla internacional correspondiente.

No obligar al usuario a escoger manualmente el puntaje después de haber definido el ámbito si el valor puede determinarse mediante las reglas parametrizadas.

Actualizar automáticamente:

* puntaje preliminar;
* máximo aplicable;
* resumen del producto;
* total del apartado;
* resumen general.

Cuando la norma diga **“hasta X puntos”**, conservar la lógica existente para valores máximos y reconocidos.

No asumir automáticamente que “hasta X” significa siempre X.

---

# 5. EXPERIENCIA CALIFICADA — CAMBIAR “HORAS” POR “HORAS SEMANALES”

Modificar el apartado:

**Experiencia calificada**

Eliminar conceptualmente el campo genérico:

`Horas`

y utilizar en todos los casos:

**Horas semanales ***

El usuario siempre debe indicar o confirmar la dedicación semanal.

Nunca interpretar un número de horas como:

* horas mensuales;
* horas totales del contrato;
* horas acumuladas;
* horas diarias.

Este campo representa EXCLUSIVAMENTE:

**cantidad de horas trabajadas por semana durante el periodo correspondiente.**

---

# 6. EXPERIENCIA CALIFICADA — TIPO DE DEDICACIÓN

Mantener/agregar un campo obligatorio:

**Tipo de dedicación ***

Opciones:

* Tiempo completo
* Tiempo parcial

El campo **Horas semanales** debe existir siempre, independientemente de la respuesta.

---

# 7. TIEMPO COMPLETO

Cuando:

`Tipo de dedicación = Tiempo completo`

establecer:

`Horas semanales = 40`

El valor debe mostrarse claramente.

Preferiblemente:

* autocompletado;
* bloqueado para edición;
* o controlado de manera que no pueda superar ni modificar indebidamente las 40 horas.

Debe quedar conceptualmente claro:

**Tiempo completo = 40 horas semanales**

No aceptar:
41
45
48
50
etc.

---

# 8. TIEMPO PARCIAL

Cuando:

`Tipo de dedicación = Tiempo parcial`

permitir introducir manualmente:

**Horas semanales**

con un máximo absoluto de:

`40`

No aceptar:

`horasSemanales > 40`

La validación debe realizarse tanto:

* en el campo;
* como en la lógica del formulario.

Mostrar un error claro si se supera:

**“La dedicación no puede superar 40 horas semanales.”**

No corregir silenciosamente 50 → 40.

Informar al evaluador para que corrija el dato.

---

# 9. VALIDACIÓN GENERAL DE HORAS

Para cualquier experiencia individual:

`0 < horasSemanales <= 40`

No permitir:

* valores negativos;
* cero;
* texto no numérico;
* más de 40 horas.

Si el sistema admite decimales, conservar únicamente una precisión razonable.

No añadir una complejidad innecesaria.

---

# 10. EXPERIENCIA CALIFICADA — COHERENCIA DE PERIODOS SUPERPUESTOS

Agregar lógica para detectar experiencias que ocurran durante el mismo intervalo temporal.

Esto es una validación de:

**coherencia de información**

y NO una comprobación de autenticidad documental.

El sistema debe analizar los rangos:

`fechaInicio`
`fechaFinalización`

de todas las experiencias existentes dentro del mismo expediente.

Detectar:

* solapamientos completos;
* solapamientos parciales;
* experiencias contenidas dentro de otra;
* periodos exactamente coincidentes.

---

# 11. LÍMITE DE DEDICACIÓN SIMULTÁNEA

Una persona no debe ser reconocida como si trabajara más de:

**40 horas semanales**

dentro de un mismo intervalo temporal.

Por tanto, al analizar experiencias simultáneas, el sistema debe considerar la suma de las horas semanales correspondientes al periodo coincidente.

Regla conceptual:

`Σ horas simultáneas <= 40`

Cuando:

`Σ horas simultáneas > 40`

existe una inconsistencia de dedicación.

Mostrar una advertencia clara.

Ejemplo:

**“Las experiencias registradas superan conjuntamente las 40 horas semanales durante un periodo coincidente. Revisa la dedicación registrada.”**

---

# 12. EXPERIENCIA DE TIEMPO COMPLETO + EXPERIENCIA SIMULTÁNEA

Caso especial prioritario:

Si una experiencia registra:

`Tiempo completo`
y
`40 horas semanales`

ese periodo ya consume la dedicación semanal máxima.

Si se registra otra experiencia que se solapa total o parcialmente con ese intervalo:

el sistema debe:

1. detectar automáticamente el solapamiento;
2. identificar el intervalo exacto de concurrencia;
3. advertir que la suma de dedicaciones supera la capacidad semanal reconocible;
4. evitar doble contabilización del mismo tiempo;
5. no sumar indiscriminadamente los puntos de ambas experiencias durante el mismo periodo.

Durante el segmento temporal superpuesto debe reconocerse, para efectos de puntaje, la actividad que resulte con el **mayor puntaje aplicable conforme a las reglas normativas/configuradas**.

IMPORTANTE:

NO crear una tabla fija adicional de prioridad entre tipos de experiencia en esta iteración.

NO introducir una jerarquía manual como regla nueva.

Utilizar los valores aplicables que ya produzca el motor normativo existente para determinar cuál representa el mayor reconocimiento durante el periodo coincidente.

---

# 13. COMBINACIÓN DE EXPERIENCIAS Y TOPE DE 40 HORAS

Cuando existan varias experiencias simultáneas y conjuntamente excedan las 40 horas:

NO eliminar automáticamente los registros.

NO impedir necesariamente que los datos queden registrados como información del expediente.

Conservar los registros para trazabilidad.

Sin embargo, para el cálculo:

* nunca reconocer más del equivalente permitido por 40 horas semanales;
* impedir doble reconocimiento del mismo periodo;
* aplicar el límite sobre el intervalo efectivamente coincidente;
* utilizar la actividad de mayor reconocimiento cuando el exceso haga necesario decidir qué experiencia prevalece;
* conservar los periodos no superpuestos de cada experiencia con su cálculo normal.

Esta lógica debe trabajar por INTERVALOS TEMPORALES, no únicamente comparando fechas completas.

---

# 14. SOLAPAMIENTO PARCIAL

Ejemplo conceptual:

Experiencia A:
01/01/2025 → 31/12/2025

Experiencia B:
01/07/2025 → 31/12/2025

El sistema debe distinguir:

01/01/2025 → 30/06/2025
solo existe A.

01/07/2025 → 31/12/2025
A y B son concurrentes.

Las reglas de concurrencia solo se aplican al periodo realmente superpuesto.

No penalizar ni modificar el periodo donde únicamente existe una experiencia.

---

# 15. EXPERIENCIAS SIMULTÁNEAS QUE NO SUPEREN EL TOPE

Si varias experiencias coinciden pero su dedicación conjunta no supera 40 horas semanales:

no marcarlas automáticamente como inválidas.

Ejemplo conceptual:

20 h/semana + 15 h/semana = 35 h/semana.

El sistema puede conservar ambas como experiencias simultáneas compatibles y aplicar la proporcionalidad correspondiente mediante las reglas de cálculo existentes.

Nunca reconocer un total semanal superior a 40.

---

# 16. VERACIDAD VS. COHERENCIA

La nueva lógica NO debe afirmar que el sistema verifica si una experiencia laboral es verdadera.

No implementar:

* detección de fraude;
* validación automática de certificados;
* consultas externas;
* confirmación automática con empresas;
* análisis jurídico de documentos.

La plataforma únicamente debe verificar COHERENCIA ESTRUCTURAL de los datos:

* máximo 40 horas semanales;
* fechas válidas;
* fecha final posterior a fecha inicial;
* detección de traslapes;
* suma de horas coincidentes;
* dedicación completa/parcial;
* prevención de doble contabilización;
* proporcionalidad;
* consistencia de los cálculos.

La autenticidad documental continúa dependiendo del proceso de revisión institucional.

---

# 17. FORMACIÓN ACADÉMICA — ELIMINAR FECHA DE INICIO

En el segundo paso:

**Formación académica**

eliminar del formulario:

**Fecha de inicio**

No mostrarla.

No validarla.

No utilizarla para cálculo.

No conservar un campo oculto innecesario.

El dato temporal principal será:

**Fecha de finalización ***

---

# 18. FORMACIÓN ACADÉMICA — VALIDACIÓN DE FECHA DE FINALIZACIÓN

El campo:

**Fecha de finalización ***

es obligatorio.

Debe cumplir dinámicamente:

`fechaFinalizacion < fechaActual`

Es decir:

la fecha máxima permitida es:

`fechaActual - 1 día`

Nunca permitir seleccionar la fecha actual.

Nunca permitir una fecha futura.

Ejemplo:

Si la fecha actual es:
27/08/2026

la fecha máxima aceptada es:
26/08/2026

Utilizar la fecha del sistema en tiempo de ejecución.

No hardcodear 2026.

Mensaje de error sugerido:

**“La fecha de finalización debe ser anterior a la fecha actual.”**

Bloquear el avance mediante **Siguiente** mientras el error continúe.

---

# 19. FORMACIÓN ACADÉMICA — LUGAR DE OBTENCIÓN

Agregar un campo obligatorio:

**Lugar de obtención ***

Opciones:

* Colombia
* Exterior

Si:

`Lugar de obtención = Colombia`

no preguntar convalidación.

No preguntar país extranjero.

Si:

`Lugar de obtención = Exterior`

mostrar dinámicamente:

**País ***

y:

**¿El título está convalidado en Colombia? ***

Opciones:

* Sí
* No

---

# 20. PAÍS DEL TÍTULO INTERNACIONAL

Para títulos obtenidos en el exterior:

**País ***

debe utilizar un dropdown/buscador con países.

No utilizar texto libre cuando sea posible.

No preguntar:

* ciudad;
* estado;
* provincia;
* fecha de convalidación;
* número de resolución de convalidación.

En esta iteración solo es necesario conocer:

* país;
* si está convalidado.

---

# 21. TÍTULO INTERNACIONAL CONVALIDADO

Si:

`Lugar de obtención = Exterior`

y:

`Convalidado en Colombia = Sí`

continuar con el flujo normal de valoración.

El título puede:

* ser validado documentalmente;
* participar en el cálculo;
* recibir el puntaje correspondiente;
* respetar topes y reglas normativas.

No agregar pasos adicionales.

---

# 22. TÍTULO INTERNACIONAL NO CONVALIDADO

Si:

`Lugar de obtención = Exterior`

y:

`Convalidado en Colombia = No`

el sistema debe:

1. conservar el registro;
2. NO eliminarlo;
3. mostrar estado:

**Pendiente de convalidación**

4. excluir su puntaje del total reconocible;
5. permitir que la información permanezca guardada en borrador;
6. impedir la finalización definitiva de la valoración mientras exista un título obligatorio/relevante pendiente de convalidación.

El título puede aparecer en resúmenes como:

`Puntaje reconocido: 0 / Pendiente`

o equivalente claro.

No tratarlo como:

* título rechazado;
* documento fraudulento;
* inexistente.

Es simplemente:

**Pendiente de convalidación.**

---

# 23. CAMBIO POSTERIOR DE CONVALIDACIÓN

Si un título previamente marcado:

`Convalidado = No`

cambia posteriormente a:

`Convalidado = Sí`

el sistema debe:

* eliminar el estado Pendiente de convalidación;
* volver a evaluar el título;
* recalcular su puntaje;
* actualizar el subtotal de Formación académica;
* actualizar el puntaje total;
* actualizar el Resumen;
* volver a evaluar si la valoración puede finalizar.

No exigir recrear el registro desde cero.

---

# 24. FORMACIÓN ACADÉMICA — TIPO ESPECIAL DE PREGRADO

Para registros de:

**Pregrado**

agregar el campo obligatorio:

**Tipo de formación de pregrado ***

Opciones:

* Medicina humana
* Composición musical
* Otro pregrado

No utilizar simplemente un checkbox:

`¿Es medicina?`

porque existe también el tratamiento especial de Composición musical.

---

# 25. PUNTAJE DE PREGRADO

Aplicar automáticamente la regla normativa correspondiente:

Si:

`Tipo = Otro pregrado`

→ 178 puntos.

Si:

`Tipo = Medicina humana`

→ 183 puntos.

Si:

`Tipo = Composición musical`

→ 183 puntos.

No pedir al evaluador que escriba manualmente esos puntos.

Actualizar automáticamente:

* puntaje del título;
* subtotal de formación;
* total del expediente;
* resumen.

---

# 26. CAMBIO DEL TIPO DE PREGRADO

Si el usuario cambia:

Otro pregrado
→ Medicina humana

o:

Medicina humana
→ Otro pregrado

o cualquier combinación:

recalcular inmediatamente el puntaje correspondiente.

No conservar valores anteriores.

No exigir eliminar y volver a crear el registro.

---

# 27. ESPECIALIZACIONES CLÍNICAS

La lógica especial de Medicina no debe limitarse al pregrado.

Cuando el usuario registre un posgrado que pueda corresponder a:

**Especialización clínica en Medicina Humana u Odontología**

el formulario debe poder identificarlo.

Agregar la clasificación necesaria, utilizando condicionales para no mostrar preguntas irrelevantes.

Por ejemplo:

Tipo de posgrado:

* Especialización
* Maestría
* Doctorado
* Especialización clínica

Si:

`Especialización clínica`

preguntar el área necesaria para distinguir:

* Medicina Humana
* Odontología

No mostrar esta pregunta para Maestría o Doctorado.

---

# 28. PUNTAJE DE ESPECIALIZACIONES CLÍNICAS

Para especializaciones clínicas en Medicina Humana y Odontología, aplicar la regla normativa ya definida en el sistema:

**15 puntos por cada año**

con máximo acumulable de:

**75 puntos**

No mezclar este cálculo con el régimen ordinario de especializaciones cuando corresponda aplicar esta regla especial.

Respetar:

* duración;
* límites;
* acumulación;
* demás condiciones normativas existentes.

---

# 29. INTERACCIÓN ENTRE INTERNACIONAL Y MEDICINA

Las condiciones pueden combinarse.

Ejemplo:

Título:
Medicina Humana

Lugar:
Exterior

País:
España

Convalidado:
No

Resultado:

El sistema debe reconocer que normativamente el tipo de pregrado correspondería a 183 puntos, PERO no incorporar dicho valor al puntaje reconocible mientras el título permanezca:

**Pendiente de convalidación**

Por tanto distinguir entre:

**Puntaje normativo potencial**
183

y:

**Puntaje reconocido actual**
0 / Pendiente de convalidación

Una vez se marque:

`Convalidado = Sí`

recalcular y reconocer los 183 puntos cuando no exista otra condición que lo impida.

---

# 30. ACTUALIZACIÓN EN TIEMPO REAL DEL RESUMEN

Todos los nuevos cambios deben propagarse correctamente hacia:

* subtotales;
* puntaje preliminar;
* puntaje reconocido;
* puntaje total;
* Resumen;
* historial cuando corresponda;
* exportación PDF del expediente.

Ejemplos:

Cambiar Nacional → Internacional
→ recalcular producto cuando la norma distinga el ámbito.

Cambiar país
→ actualizar registro, pero no modificar puntaje salvo regla explícita.

Cambiar horas semanales
→ recalcular experiencia.

Crear traslape
→ recalcular intervalo reconocido.

Eliminar traslape
→ restaurar cálculo normal.

Marcar título como no convalidado
→ excluirlo del puntaje reconocido.

Marcarlo posteriormente como convalidado
→ reincorporarlo.

Cambiar Otro pregrado → Medicina humana
→ 178 → 183.

No requerir refrescar manualmente la página.

---

# 31. PERSISTENCIA DE LA NUEVA INFORMACIÓN

Los nuevos campos deben formar parte del estado real del expediente.

Persistir:

## Productividad académica

* ámbito nacional/internacional;
* país cuando corresponda.

## Experiencia calificada

* tipo de dedicación;
* horas semanales;
* información necesaria para determinar concurrencia.

## Formación académica

* fecha de finalización;
* lugar de obtención;
* país cuando sea exterior;
* estado de convalidación;
* tipo especial de pregrado;
* clasificación clínica cuando corresponda.

No crear campos puramente visuales que desaparezcan al cambiar de pantalla.

Al:

* Guardar borrador;
* ir hacia atrás;
* avanzar;
* volver posteriormente a editar;

los datos deben conservarse.

---

# 32. VALIDACIÓN AL PULSAR “SIGUIENTE”

Mantener la regla existente:

las validaciones principales se presentan al pulsar:

**Siguiente**

No introducir validaciones agresivas mientras el usuario apenas escribe, salvo controles estructurales obvios como impedir valores fuera del rango.

Ejemplos que deben impedir avanzar:

### Formación

* fecha de finalización vacía;
* fecha actual;
* fecha futura;
* título internacional sin país;
* título internacional sin responder convalidación.

### Experiencia

* horas vacías;
* horas <= 0;
* horas > 40;
* fechas inválidas;
* contradicción temporal que impida aplicar correctamente la regla.

### Productividad

* seleccionar Internacional y no indicar país cuando el ámbito sea obligatorio.

Mostrar los errores junto al campo relacionado.

---

# 33. CONDICIONES PARA FINALIZAR

Reevaluar la función lógica equivalente a:

`canFinalize`

La valoración NO puede finalizar cuando exista alguno de estos problemas:

* errores estructurales de experiencia no resueltos;
* dedicaciones imposibles;
* periodos con cálculos inconsistentes;
* campos obligatorios pendientes;
* productos internacionales obligatorios sin país;
* títulos internacionales pendientes de convalidación cuando deban formar parte de la valoración;
* demás bloqueos ya existentes en el sistema.

No bloquear por:

* comentario general vacío, porque es opcional;
* país en productos nacionales;
* país en títulos obtenidos en Colombia;
* datos condicionales que no sean aplicables.

---

# 34. MENSAJES DE ERROR Y ADVERTENCIA

Utilizar mensajes humanos y específicos.

Correcto:

**“La dedicación no puede superar 40 horas semanales.”**

**“Estas experiencias coinciden en el mismo periodo y superan conjuntamente las 40 horas semanales.”**

**“La fecha de finalización debe ser anterior a la fecha actual.”**

**“Selecciona el país donde fue obtenido el título.”**

**“Este título está pendiente de convalidación en Colombia y todavía no puede incorporarse al puntaje reconocido.”**

Incorrecto:

“Invalid input”

“Error”

“Bad value”

“Something went wrong”

No utilizar mensajes técnicos dirigidos al usuario final.

---

# 35. NO HACER

NO rediseñar el sistema.

NO modificar el dashboard salvo añadir “Descargar expediente”.

NO convertir la descarga individual en el módulo general de Exportar datos.

NO ofrecer Excel o CSV dentro de “Descargar expediente”.

NO pedir nombre de archivo.

NO exportar automáticamente todos los soportes dentro del PDF.

NO preguntar Nacional/Internacional cuando la norma no lo diferencia.

NO pedir país para productos nacionales.

NO pedir ciudad para productos internacionales.

NO inventar puntajes por país.

NO considerar un país “más internacional” que otro.

NO cambiar “Horas semanales” por horas totales.

NO permitir más de 40 horas semanales.

NO permitir que Tiempo completo tenga más de 40 horas.

NO sumar sin control experiencias simultáneas.

NO contabilizar dos veces el mismo intervalo temporal cuando se supera la dedicación admisible.

NO eliminar experiencias automáticamente solo porque haya solapamiento.

NO afirmar que un traslape demuestra falsedad documental.

NO afirmar que el sistema comprueba veracidad laboral real.

NO aplicar detección automática de fraude.

NO pedir Fecha de inicio dentro de Formación académica.

NO permitir Fecha de finalización = fecha actual.

NO permitir fechas futuras de finalización.

NO preguntar convalidación para títulos colombianos.

NO pedir fecha de convalidación.

NO pedir número de resolución de convalidación en esta iteración.

NO borrar títulos internacionales no convalidados.

NO darles puntaje reconocible mientras estén pendientes.

NO tratarlos como fraudulentos.

NO permitir finalizar ignorando una convalidación pendiente relevante.

NO reducir Medicina a un simple checkbox cuando también existe Composición musical.

NO olvidar las especializaciones clínicas de Medicina Humana y Odontología.

NO hardcodear la fecha actual.

NO introducir reglas adicionales de prioridad de experiencia que no estén descritas aquí.

NO modificar otras reglas normativas existentes.

---

# 36. PRUEBAS LÓGICAS OBLIGATORIAS

Antes de considerar terminada esta iteración, comprobar los siguientes escenarios.

### TEST 01 — Descargar expediente

Abrir:
Inicio → Ver

Debe aparecer:
Descargar expediente.

Al ejecutarlo:
genera PDF.

Nombre esperado similar a:

`Expediente_VAL-2026-0001_Laura-Martinez-Gomez.pdf`

---

### TEST 02 — Producto nacional

Modalidad donde existe diferencia nacional/internacional.

Seleccionar:
Nacional.

Resultado:

* País oculto;
* regla nacional aplicada.

---

### TEST 03 — Producto internacional

Seleccionar:
Internacional.

Resultado:

* aparece País obligatorio;
* no permite continuar si está vacío;
* selección de país persiste;
* regla internacional se utiliza cuando corresponda.

---

### TEST 04 — Tiempo completo

Seleccionar:
Tiempo completo.

Resultado:

Horas semanales = 40.

Nunca > 40.

---

### TEST 05 — Tiempo parcial inválido

Introducir:

45 horas.

Resultado:

bloquear dato y mostrar:

“La dedicación no puede superar 40 horas semanales.”

---

### TEST 06 — Dos experiencias que exceden el límite

Experiencia A:
30 h.

Experiencia B:
20 h.

Mismo periodo.

Resultado:

50 h concurrentes.

Debe:

* detectar inconsistencia;
* no reconocer 50;
* aplicar máximo reconocido compatible con 40;
* evitar doble contabilización.

---

### TEST 07 — Tiempo completo simultáneo

A:
40 h, tiempo completo.

B:
10 h, periodo coincidente.

Resultado:

detectar concurrencia.

No sumar ambas como 50 h reconocibles.

Aplicar durante el intervalo concurrente la experiencia con mayor reconocimiento conforme al motor de reglas, sin introducir una jerarquía fija nueva.

---

### TEST 08 — Solapamiento parcial

A:
enero-diciembre.

B:
julio-diciembre.

Resultado:

enero-junio:
A normal.

julio-diciembre:
aplicar reglas de concurrencia.

---

### TEST 09 — Fecha de formación actual

Fecha de finalización:
hoy.

Resultado:
inválida.

---

### TEST 10 — Fecha futura

Fecha de finalización:
mañana.

Resultado:
inválida.

---

### TEST 11 — Fecha válida

Fecha:
ayer.

Resultado:
válida.

---

### TEST 12 — Título colombiano

Lugar:
Colombia.

Resultado:

NO mostrar:
País.
Convalidación.

---

### TEST 13 — Título internacional

Lugar:
Exterior.

Resultado:

mostrar:
País.
¿El título está convalidado en Colombia?

---

### TEST 14 — Internacional no convalidado

Exterior.
España.
Convalidado = No.

Resultado:

Estado:
Pendiente de convalidación.

No sumar puntaje reconocible.

Impedir cierre cuando corresponda.

---

### TEST 15 — Convalidación posterior

Cambiar:
No → Sí.

Resultado:
recalcular automáticamente.

---

### TEST 16 — Pregrado normal

Tipo:
Otro pregrado.

Resultado:
178 puntos.

---

### TEST 17 — Medicina Humana

Tipo:
Medicina humana.

Resultado:
183 puntos.

---

### TEST 18 — Composición musical

Tipo:
Composición musical.

Resultado:
183 puntos.

---

### TEST 19 — Especialización clínica

Registrar especialización clínica de Medicina Humana u Odontología.

Resultado:

aplicar:
15 puntos por año,
hasta máximo acumulable de 75,
conforme a las demás reglas existentes.

---

# 37. RESULTADO ESPERADO

Al terminar esta modificación, el prototipo existente debe conservar exactamente su línea visual y estructura general, pero incorporar una lógica significativamente más robusta en cuatro áreas:

### Inicio

Descarga individual resumida del expediente en PDF.

### Productividad académica

Clasificación Nacional/Internacional únicamente donde sea normativamente relevante, país condicional y recálculo correspondiente.

### Experiencia calificada

Dedicación semanal explícita, máximo 40 horas, Tiempo completo = 40 h, detección de concurrencias, cálculo por intervalos y prevención de doble contabilización.

### Formación académica

Eliminación de fecha de inicio, fecha de finalización estrictamente anterior al día actual, títulos nacionales/internacionales, convalidación, Medicina Humana, Composición musical y especializaciones clínicas.

Implementa ahora estos cambios sobre el proyecto existente.

NO reconstruyas la aplicación desde cero.

NO alteres funcionalidades que no hayan sido mencionadas.

Prioriza la consistencia del estado, las validaciones, los cálculos y el comportamiento condicional.
