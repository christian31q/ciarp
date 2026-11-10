PROMPT DE CORRECCIÓN DE LÓGICA — FIGMA MAKE
PROYECTO: “Registro, validación y valoración”
UNIVERSIDAD MILITAR NUEVA GRANADA

Trabaja SOBRE EL CÓDIGO Y PROTOTIPO EXISTENTE.

NO reconstruyas la aplicación desde cero.
NO cambies el diseño visual.
NO cambies la arquitectura general.
NO cambies la navegación.
NO cambies colores, tipografía, sidebar, cards, tablas, botones ni estructura del wizard.
NO elimines funcionalidades existentes.
NO modifiques reglas que no estén directamente relacionadas con esta corrección.

Esta iteración debe modificar exclusivamente la LÓGICA y los campos estrictamente necesarios de:

1. Formación académica.
2. Experiencia calificada.

Conserva el código existente siempre que sea posible y modifica únicamente componentes, estados, funciones de cálculo, validaciones y condicionales necesarios.

────────────────────────────────────
1. FORMACIÓN ACADÉMICA — OBJETIVO
────────────────────────────────────

Corregir y ampliar la lógica del paso:

“Formación académica”

para que el sistema diferencie correctamente los tipos especiales de formación contemplados en el Decreto 1279 de 2002 y calcule el puntaje correspondiente.

La aplicación debe diferenciar explícitamente:

PREGRADO
- Pregrado general
- Medicina Humana
- Composición Musical

POSGRADO
- Especialización general
- Especialización clínica en Medicina Humana
- Especialización clínica en Odontología
- Maestría / Magíster
- Doctorado / Ph.D.

Las opciones mostradas deben cambiar dinámicamente dependiendo del nivel seleccionado.

────────────────────────────────────
2. PREGRADO
────────────────────────────────────

Cuando:

Nivel de formación = Pregrado

mostrar un campo obligatorio:

“Tipo de pregrado”

Opciones:

- Pregrado general
- Medicina Humana
- Composición Musical

Aplicar automáticamente estos puntajes:

Pregrado general
= 178 puntos

Medicina Humana
= 183 puntos

Composición Musical
= 183 puntos

No permitir que el usuario escriba manualmente estos puntajes.

El sistema debe calcularlos automáticamente según la opción seleccionada.

Ejemplo lógico:

if tipoPregrado === "general"
    puntajeBase = 178

if tipoPregrado === "medicina_humana"
    puntajeBase = 183

if tipoPregrado === "composicion_musical"
    puntajeBase = 183

Al cambiar el tipo de pregrado, recalcular inmediatamente:

- puntaje del registro;
- subtotal de Formación académica;
- puntaje total de la valoración;
- resumen final;
- cualquier elemento que consuma ese puntaje.

NO exigir eliminar y volver a crear el registro.

────────────────────────────────────
3. ESPECIALIZACIÓN GENERAL
────────────────────────────────────

Cuando:

Nivel de formación = Especialización

y NO corresponda a especialización clínica de Medicina Humana u Odontología, aplicar la regla general.

La duración debe influir en el puntaje.

Reglas:

Especialización general con duración entre 1 y 2 años:
hasta 20 puntos.

Especialización general de más de 2 años:
puede recibir hasta 10 puntos adicionales por cada año adicional.

Máximo absoluto:
30 puntos.

Ejemplos conceptuales de TOPE:

1 año
→ máximo 20

2 años
→ máximo 20

3 años
→ máximo 30

4 años o más
→ máximo 30

IMPORTANTE:

La norma utiliza la expresión “hasta”.

Por tanto, NO interpretar automáticamente que todo registro necesariamente recibe el máximo.

La aplicación debe diferenciar conceptualmente:

“Puntaje máximo aplicable”

y

“Puntaje reconocido”

si el sistema ya dispone de lógica o parámetros para determinar el valor reconocido.

Nunca permitir:

puntajeReconocido > puntajeMaximoAplicable

Ejemplo:

puntajeFinal =
min(puntajeReconocido, puntajeMaximoAplicable)

No modificar otras reglas de acumulación de especializaciones ya implementadas.

────────────────────────────────────
4. ESPECIALIZACIÓN CLÍNICA
────────────────────────────────────

Agregar lógica específica para:

- Medicina Humana
- Odontología

Cuando el usuario seleccione una especialización, debe poder distinguir si corresponde a una especialización clínica.

La interfaz puede resolverlo mediante campos condicionales.

Ejemplo:

“Tipo de especialización”

Opciones:

- Especialización general
- Especialización clínica

Si:

Tipo de especialización = Especialización clínica

mostrar:

“Área clínica”

Opciones:

- Medicina Humana
- Odontología

No mostrar este campo cuando sea una especialización general.

────────────────────────────────────
5. PUNTAJE DE ESPECIALIZACIÓN CLÍNICA
────────────────────────────────────

Para Especialización clínica en Medicina Humana u Odontología:

15 puntos por cada año.

Máximo acumulable:
75 puntos.

Fórmula:

puntajeCalculado =
duracionAnios × 15

puntajeFinal =
min(puntajeCalculado, 75)

Ejemplos:

1 año
→ 15 puntos

2 años
→ 30 puntos

3 años
→ 45 puntos

4 años
→ 60 puntos

5 años
→ 75 puntos

6 años
→ 75 puntos

No permitir superar los 75 puntos.

No aplicar simultáneamente la regla de especialización general y la regla de especialización clínica.

Una especialización clínica debe utilizar exclusivamente la lógica clínica correspondiente.

────────────────────────────────────
6. MAESTRÍA / MAGÍSTER
────────────────────────────────────

Cuando:

Nivel de formación = Maestría / Magíster

establecer:

Puntaje máximo aplicable:
40 puntos.

Como la norma indica “hasta 40 puntos”, no asumir obligatoriamente 40 si el sistema tiene un valor reconocido configurable.

Regla:

puntajeFinal =
min(puntajeReconocido, 40)

No modificar otras reglas existentes relacionadas con acumulación de maestrías.

────────────────────────────────────
7. DOCTORADO / PH.D.
────────────────────────────────────

Cuando:

Nivel de formación = Doctorado / Ph.D.

agregar una condición necesaria para el cálculo:

“¿Tiene Maestría reconocida?”

Opciones:

- Sí
- No

La pregunta debe afectar el máximo aplicable.

Si:

Tiene Maestría reconocida = Sí

Puntaje máximo:
80 puntos.

Si:

Tiene Maestría reconocida = No

Puntaje máximo:
120 puntos.

Lógica:

if tieneMaestriaReconocida === true
    puntajeMaximo = 80

if tieneMaestriaReconocida === false
    puntajeMaximo = 120

Como la norma utiliza “hasta”, respetar nuevamente:

puntajeFinal =
min(puntajeReconocido, puntajeMaximo)

No asignar automáticamente 80 o 120 si el sistema dispone de una etapa institucional que determina un valor inferior.

────────────────────────────────────
8. TABLA LÓGICA OBLIGATORIA
────────────────────────────────────

La aplicación debe responder internamente a la siguiente matriz:

PREGRADO

Pregrado general
→ 178 puntos.

Medicina Humana
→ 183 puntos.

Composición Musical
→ 183 puntos.


ESPECIALIZACIÓN GENERAL

Duración 1–2 años
→ hasta 20 puntos.

Más de 2 años
→ hasta 10 puntos adicionales por año adicional.

Máximo
→ 30 puntos.


ESPECIALIZACIÓN CLÍNICA

Medicina Humana
→ 15 puntos/año.
→ máximo 75.

Odontología
→ 15 puntos/año.
→ máximo 75.


MAESTRÍA / MAGÍSTER

→ hasta 40 puntos.


DOCTORADO / PH.D.

Con Maestría reconocida
→ hasta 80 puntos.

Sin Maestría reconocida
→ hasta 120 puntos.

────────────────────────────────────
9. CONVIVENCIA CON LA LÓGICA DE TÍTULOS INTERNACIONALES
────────────────────────────────────

Mantener intacta la lógica ya implementada de:

- Colombia / Exterior;
- país;
- convalidación.

Las nuevas clasificaciones deben combinarse correctamente con esa lógica.

Ejemplo:

Nivel:
Pregrado

Tipo:
Medicina Humana

Lugar de obtención:
Exterior

País:
España

Convalidado en Colombia:
No

El sistema debe identificar correctamente:

Puntaje normativo potencial:
183 puntos

pero:

Puntaje reconocido actual:
0 / Pendiente de convalidación

No sumar los 183 puntos mientras continúe pendiente de convalidación.

Si posteriormente:

Convalidado = Sí

recalcular automáticamente y reconocer el puntaje correspondiente cuando no exista otro bloqueo.

Esta misma lógica debe funcionar para:

- Pregrado general;
- Medicina Humana;
- Composición Musical;
- Especializaciones;
- Especializaciones clínicas;
- Maestrías;
- Doctorados.

────────────────────────────────────
10. RECÁLCULO AUTOMÁTICO
────────────────────────────────────

Cualquier cambio que afecte Formación académica debe actualizar automáticamente:

registro individual
→ subtotal de Formación académica
→ puntaje total
→ resumen final
→ historial si utiliza el puntaje
→ PDF/resumen del expediente si utiliza el puntaje

No requerir recargar la página.

No requerir pulsar un botón adicional de “Recalcular”.

Ejemplos:

Pregrado general → Medicina Humana
178 → 183

Medicina Humana → Composición Musical
183 → 183

Especialización general → clínica
recalcular con la nueva regla.

Doctorado:
Maestría reconocida Sí → No
actualizar tope 80 → 120.

────────────────────────────────────
11. EXPERIENCIA CALIFICADA — FECHA DE FINALIZACIÓN
────────────────────────────────────

Modificar ahora la lógica de:

“Experiencia calificada”

La fecha de finalización de una experiencia puede ser:

- una fecha pasada;
- el día actual;
- o puede tratarse de una experiencia que continúa actualmente.

La fecha de finalización nunca puede ser futura.

Regla:

fechaFinalizacion <= fechaActual

A diferencia del apartado Formación académica, en Experiencia calificada SÍ se permite seleccionar el día de hoy.

Ejemplo:

Si hoy es:
27/08/2026

entonces:

26/08/2026
→ válido

27/08/2026
→ válido

28/08/2026
→ inválido

NO hardcodear una fecha concreta.

Utilizar siempre la fecha actual del sistema.

────────────────────────────────────
12. OPCIÓN “ACTUALMENTE”
────────────────────────────────────

Agregar junto al campo de fecha de finalización una opción:

“Actualmente”

Preferiblemente mediante checkbox:

☐ Actualmente

Estado lógico recomendado:

actualmente: boolean

fechaInicio: Date

fechaFinalizacion: Date | null

────────────────────────────────────
13. COMPORTAMIENTO CUANDO “ACTUALMENTE” = NO
────────────────────────────────────

Si:

actualmente = false

el campo:

“Fecha de finalización”

es obligatorio.

Debe cumplir:

fechaFinalizacion >= fechaInicio

y:

fechaFinalizacion <= fechaActual

Si:

fechaFinalizacion < fechaInicio

mostrar:

“La fecha de finalización debe ser igual o posterior a la fecha de inicio.”

Si:

fechaFinalizacion > fechaActual

mostrar:

“La fecha de finalización no puede ser posterior a la fecha actual.”

Impedir continuar mientras exista el error.

────────────────────────────────────
14. COMPORTAMIENTO CUANDO “ACTUALMENTE” = SÍ
────────────────────────────────────

Si el usuario marca:

Actualmente = Sí

debe ocurrir automáticamente:

1. deshabilitar el selector de Fecha de finalización;

2. limpiar cualquier fecha final que hubiera sido seleccionada previamente;

3. guardar internamente:

fechaFinalizacion = null

4. mantener:

actualmente = true

5. mostrar visualmente:

“Actualidad”

6. para todos los cálculos temporales utilizar dinámicamente la fecha actual como final provisional del periodo.

Ejemplo lógico:

fechaFinParaCalculo =
actualmente
    ? fechaActual
    : fechaFinalizacion

IMPORTANTE:

NO guardar permanentemente la fecha actual como si la experiencia hubiera terminado hoy.

Una experiencia actual debe conservar:

actualmente = true

fechaFinalizacion = null

Esto permite que siga siendo interpretada como vigente posteriormente.

────────────────────────────────────
15. CAMBIO DE “ACTUALMENTE” A FECHA DE FINALIZACIÓN
────────────────────────────────────

Si el usuario desmarca:

Actualmente

el campo:

“Fecha de finalización”

debe volver a habilitarse.

Debe quedar vacío y convertirse nuevamente en obligatorio.

No reutilizar silenciosamente una fecha anterior que hubiese sido eliminada al marcar “Actualmente”.

────────────────────────────────────
16. DURACIÓN DE EXPERIENCIA ACTUAL
────────────────────────────────────

Para calcular la duración de una experiencia activa:

fechaInicio
→ fecha actual

Ejemplo conceptual:

Fecha inicio:
01/02/2024

Actualmente:
Sí

Fecha final utilizada para cálculo:
fecha actual del sistema.

La duración debe recalcularse dinámicamente.

────────────────────────────────────
17. EXPERIENCIAS ACTUALES Y SOLAPAMIENTOS
────────────────────────────────────

Integrar “Actualmente” con toda la lógica existente de:

- máximo 40 horas semanales;
- Tiempo completo;
- Tiempo parcial;
- detección de traslapes;
- periodos coincidentes;
- prevención de doble contabilización.

Una experiencia marcada como:

Actualmente

debe considerarse activa hasta la fecha de hoy para el análisis temporal.

Ejemplo:

EXPERIENCIA A

01/01/2024
→ Actualidad
40 horas semanales

EXPERIENCIA B

01/01/2026
→ 30/06/2026
10 horas semanales

El sistema debe detectar correctamente que B ocurre dentro del periodo activo de A.

Debe aplicar la lógica existente de concurrencia y límite semanal.

No ignorar una experiencia solo porque fechaFinalizacion = null.

────────────────────────────────────
18. EXPERIENCIAS ACTUALES Y TIEMPO COMPLETO
────────────────────────────────────

Ejemplo:

Experiencia A:
Tiempo completo
40 h/semana
01/01/2025
→ Actualidad

Experiencia B:
Tiempo parcial
15 h/semana
01/01/2026
→ Actualidad

El sistema debe detectar:

40 + 15 = 55 horas simultáneas

y activar las mismas reglas de inconsistencia/concurrencia ya implementadas.

No reconocer 55 horas.

No modificar en esta iteración la estrategia existente para decidir qué parte del puntaje es reconocible.

Solo asegurarse de que las experiencias marcadas “Actualmente” participen correctamente en esa lógica.

────────────────────────────────────
19. VALIDACIÓN DE FECHA DE INICIO
────────────────────────────────────

Mantener o agregar también esta regla:

fechaInicio <= fechaActual

No permitir comenzar una experiencia en el futuro.

Si:

fechaInicio > fechaActual

mostrar:

“La fecha de inicio no puede ser posterior a la fecha actual.”

Si:

actualmente = false

también debe cumplirse:

fechaInicio <= fechaFinalizacion

────────────────────────────────────
20. PERSISTENCIA
────────────────────────────────────

Los nuevos campos deben formar parte del estado real de la valoración.

Persistir en Formación académica:

- nivel;
- tipo de pregrado;
- tipo de especialización;
- área clínica;
- duración;
- existencia de Maestría reconocida cuando corresponda;
- puntaje máximo;
- puntaje reconocido;
- demás información ya existente.

Persistir en Experiencia calificada:

- fechaInicio;
- fechaFinalizacion;
- actualmente;
- horas semanales;
- tipo de dedicación;
- demás información ya existente.

Si el usuario:

- pulsa Guardar borrador;
- avanza;
- vuelve atrás;
- sale de la valoración;
- continúa posteriormente;

los datos deben conservarse correctamente conforme al mecanismo de persistencia existente.

────────────────────────────────────
21. NO HACER
────────────────────────────────────

NO reconstruir la aplicación.

NO modificar el estilo visual.

NO cambiar la sidebar.

NO cambiar el dashboard.

NO cambiar la navegación.

NO agregar páginas nuevas innecesarias.

NO modificar Productividad académica en esta iteración.

NO modificar Exportar datos.

NO modificar Historial.

NO cambiar reglas de Experiencia calificada que no estén relacionadas con la fecha final o “Actualmente”.

NO cambiar los topes semanales existentes.

NO eliminar la lógica de 40 horas.

NO eliminar detección de traslapes.

NO cambiar puntajes de experiencia.

NO inventar nuevas categorías académicas.

NO llamar “Medicina” de manera genérica cuando la categoría normativa sea “Medicina Humana”.

NO olvidar Composición Musical.

NO tratar Medicina Humana y Composición Musical como pregrados generales de 178 puntos.

NO aplicar 20–30 puntos de especialización general a una especialización clínica de Medicina Humana u Odontología.

NO permitir que una especialización clínica supere 75 puntos.

NO asignar siempre automáticamente el máximo cuando la norma diga “hasta”.

NO permitir que una Maestría supere 40 puntos.

NO permitir Doctorado con Maestría reconocida por encima de 80 puntos.

NO permitir Doctorado sin Maestría reconocida por encima de 120 puntos bajo esta regla.

NO ignorar la convalidación de títulos extranjeros.

NO sumar títulos pendientes de convalidación al puntaje reconocido.

NO permitir fechas futuras en Experiencia calificada.

NO hacer que Experiencia y Formación académica utilicen la misma restricción de fecha.

Recordar:

FORMACIÓN ACADÉMICA:
fecha de finalización < hoy.

EXPERIENCIA CALIFICADA:
fecha de finalización <= hoy.

NO guardar “hoy” como fecha definitiva cuando el usuario selecciona “Actualmente”.

NO ignorar “Actualmente” en los cálculos de duración.

NO ignorar “Actualmente” en la detección de solapamientos.

────────────────────────────────────
22. PRUEBAS OBLIGATORIAS
────────────────────────────────────

Antes de finalizar la modificación, probar:

TEST 01

Pregrado general

Resultado:
178 puntos.

TEST 02

Medicina Humana

Resultado:
183 puntos.

TEST 03

Composición Musical

Resultado:
183 puntos.

TEST 04

Especialización general de 2 años

Resultado:
máximo aplicable 20 puntos.

TEST 05

Especialización general de 3 años

Resultado:
máximo aplicable 30 puntos.

TEST 06

Especialización general de 4 años

Resultado:
no superar máximo 30.

TEST 07

Especialización clínica Medicina Humana:
2 años.

Resultado:
30 puntos.

TEST 08

Especialización clínica Odontología:
5 años.

Resultado:
75 puntos.

TEST 09

Especialización clínica:
6 años.

Resultado:
máximo 75.

TEST 10

Maestría.

Resultado:
máximo aplicable 40.

TEST 11

Doctorado con Maestría reconocida.

Resultado:
máximo aplicable 80.

TEST 12

Doctorado sin Maestría reconocida.

Resultado:
máximo aplicable 120.

TEST 13

Medicina Humana extranjera no convalidada.

Resultado:

puntaje potencial:
183

puntaje reconocido:
0 / pendiente.

TEST 14

Medicina Humana extranjera:
cambiar Convalidado No → Sí.

Resultado:
recalcular automáticamente.

TEST 15

Experiencia finalizada ayer.

Resultado:
válida.

TEST 16

Experiencia finalizada hoy.

Resultado:
válida.

TEST 17

Experiencia finalizada mañana.

Resultado:
inválida.

TEST 18

Marcar “Actualmente”.

Resultado:

fechaFinalizacion = null
actualmente = true

UI:
“Actualidad”

Cálculos:
usar fecha actual.

TEST 19

Desmarcar “Actualmente”.

Resultado:
Fecha de finalización vuelve a estar habilitada y obligatoria.

TEST 20

Experiencia de 40 horas marcada “Actualmente” + otra experiencia coincidente.

Resultado:
la lógica de solapamientos y máximo de 40 h debe seguir funcionando correctamente.

────────────────────────────────────
23. RESULTADO FINAL
────────────────────────────────────

Implementa estas correcciones directamente sobre el código existente.

El resultado debe conseguir específicamente:

A. que Formación académica calcule correctamente los casos especiales de:

- Pregrado general;
- Medicina Humana;
- Composición Musical;
- Especialización general;
- Especialización clínica de Medicina Humana;
- Especialización clínica de Odontología;
- Maestría;
- Doctorado con Maestría;
- Doctorado sin Maestría.

B. que Experiencia calificada permita:

- finalizar una experiencia hasta el día de hoy;
- registrar una experiencia que continúa actualmente;
- utilizar “Actualidad” correctamente en cálculos;
- conservar las validaciones temporales;
- integrar experiencias vigentes con la lógica existente de traslapes y máximo de 40 horas semanales.

NO realices otras modificaciones fuera de este alcance.