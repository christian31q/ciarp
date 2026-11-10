PROMPT MASTER — CORRECCIÓN DEL MOTOR DE PUNTAJES DE FORMACIÓN ACADÉMICA
FIGMA MAKE — MODIFICAR EL CÓDIGO EXISTENTE

PROYECTO:
“Registro, validación y valoración”
Universidad Militar Nueva Granada

============================================================
0. OBJETIVO DE ESTA ITERACIÓN
============================================================

Trabaja SOBRE EL CÓDIGO Y PROYECTO EXISTENTES.

NO reconstruyas la aplicación.

NO rediseñes el sistema.

NO cambies:
- sidebar;
- navegación;
- dashboard;
- wizard;
- componentes;
- formularios;
- campos existentes;
- lógica de Experiencia calificada;
- lógica de Productividad académica;
- lógica de Categoría docente;
- exportaciones;
- autenticación;
- estados generales del expediente;
- diseño visual;
- tipografía;
- colores;
- layout;
- funcionamiento de Guardar borrador;
- lógica documental;
- lógica de convalidación, salvo su impacto en el cálculo de Formación.

ESTA ITERACIÓN MODIFICA ÚNICAMENTE:

LA LÓGICA DE CÁLCULO, COMBINACIÓN, SUMATORIA Y TOPES
DEL APARTADO:

“FORMACIÓN ACADÉMICA”

La lógica individual de los títulos ya existente debe conservarse, pero la SUMATORIA ACTUAL DEBE SER REEMPLAZADA por un único motor centralizado capaz de:

1. identificar los títulos válidos;
2. ordenarlos correctamente;
3. identificar la combinación o “combo” aplicable;
4. modificar el valor reconocido de determinados títulos cuando participan en un combo;
5. aplicar topes específicos;
6. aplicar el tope global de posgrados;
7. mantener el pregrado separado;
8. recalcular automáticamente cuando cambie cualquier título;
9. mostrar al usuario cómo se obtuvo el resultado.

NO agregues esta lógica encima de la sumatoria anterior.

REEMPLAZA LA SUMATORIA ANTERIOR.

Debe existir una única fuente de verdad para el cálculo final de Formación académica.

============================================================
1. PRINCIPIO FUNDAMENTAL DEL CÁLCULO
============================================================

El puntaje de Formación académica se divide obligatoriamente en dos bloques independientes:

A. PREGRADO

B. POSGRADO

El pregrado NO participa dentro del tope de posgrados.

El máximo reconocido para PREGRADO es:

183 puntos.

El máximo acumulable para POSGRADOS es:

140 puntos.

Por tanto:

puntajeFormacionTotal =
puntajePregradoReconocido
+
puntajePosgradosReconocido

con las restricciones:

puntajePregradoReconocido <= 183

puntajePosgradosReconocido <= 140

El total máximo teórico de Formación académica puede ser:

183 + 140 = 323 puntos.

NO aplicar un tope global de 140 sobre toda Formación académica.

Eso sería incorrecto.

El límite de 140 corresponde exclusivamente al bloque de POSGRADOS.

============================================================
2. PREGRADO — CONSERVAR LÓGICA ACTUAL
============================================================

NO modificar la lógica individual existente del pregrado.

Debe mantenerse:

Pregrado general:
178 puntos.

Medicina Humana:
183 puntos.

Composición Musical:
183 puntos.

El máximo reconocido dentro del bloque de pregrado es:

183 puntos.

Si existen varios títulos de pregrado, conservar la lógica existente para determinar cuál es reconocible.

No sumar varios pregrados superando 183.

El bloque de Pregrado debe producir finalmente:

puntajePregradoReconocido <= 183

============================================================
3. POSGRADOS — NUEVO MOTOR DE COMBINACIONES
============================================================

La sumatoria de posgrados NO puede realizarse simplemente así:

titulo1 + titulo2 + titulo3 + titulo4

porque el valor reconocido de un título puede cambiar dependiendo de los otros títulos existentes.

El sistema debe analizar el CONJUNTO COMPLETO de títulos de posgrado válidos.

Después debe determinar automáticamente qué regla o combinación corresponde.

Ejemplo:

Una Especialización normal puede tener un máximo individual de 30 puntos.

Sin embargo:

Especialización + Maestría

se reconoce con la combinación:

Especialización:
20 puntos.

Maestría:
40 puntos.

Total:
60 puntos.

Por tanto:

EL VALOR DE UN TÍTULO PUEDE CAMBIAR SEGÚN EL COMBO.

Esto es intencional.

============================================================
4. SOLO TÍTULOS RECONOCIBLES PARTICIPAN EN LOS COMBOS
============================================================

Antes de calcular combinaciones, filtrar los títulos.

Solo participan en el motor de puntaje los títulos que se encuentren en estado reconocible/válido conforme a la lógica actual.

NO deben participar todavía:

- títulos pendientes de convalidación;
- títulos observados que no puedan reconocerse;
- títulos pendientes de validación;
- títulos rechazados;
- títulos que por alguna condición vigente tengan puntaje reconocido 0;
- registros incompletos.

Estos registros NO deben eliminarse.

Deben continuar visibles en el expediente.

Simplemente:

NO participan en la sumatoria reconocida.

Ejemplo:

Maestría colombiana válida
+
Doctorado extranjero pendiente de convalidación

El motor debe calcular temporalmente:

solo Maestría.

Cuando posteriormente el Doctorado pase a:

Convalidado / válido

el sistema debe recalcular automáticamente y aplicar:

Maestría + Doctorado.

============================================================
5. ORDEN CRONOLÓGICO
============================================================

Cuando existan múltiples títulos del mismo nivel, el concepto:

“primer título”
“segundo título”
“título adicional”

debe determinarse por ORDEN CRONOLÓGICO.

NO por orden de digitación.

NO por orden en que fueron agregados al formulario.

Utilizar la fecha de finalización/grado existente.

Orden:

más antiguo
→ primer título

siguiente cronológicamente
→ segundo título

etc.

Si dos títulos tienen exactamente la misma fecha, utilizar un criterio interno estable únicamente para desempatar, sin modificar puntajes arbitrariamente.

============================================================
6. PRINCIPIO DE SELECCIÓN DEL COMBO
============================================================

El sistema debe detectar automáticamente el combo aplicable.

El evaluador NO selecciona manualmente:

“Combo 1”
“Combo 2”
etc.

Si el conjunto de títulos puede interpretarse bajo más de una regla válida:

el motor debe evaluar las combinaciones permitidas y seleccionar automáticamente la que otorgue el MAYOR PUNTAJE RECONOCIBLE válido.

Siempre debe respetar:

- reglas específicas del combo;
- orden cronológico;
- límites particulares;
- máximo global de posgrados = 140.

Nunca seleccionar una combinación que contradiga las reglas simplemente porque produzca más puntos.

============================================================
7. DIFERENCIAR PUNTAJE BRUTO Y RECONOCIDO
============================================================

El motor debe manejar como mínimo:

puntajeBruto

puntajeMaximoCombo

puntajeReconocido

Ejemplo:

Puntaje bruto:
155

Tope aplicable:
140

Puntaje reconocido:
140

NO borrar el puntaje bruto.

NO fingir que el cálculo original dio 140.

El usuario debe poder entender que existió un ajuste por tope.

============================================================
8. TOPE GLOBAL DE POSGRADOS
============================================================

Después de aplicar cualquier regla específica o combo:

APLICAR SIEMPRE un segundo control global:

puntajePosgradosReconocido =
min(
    puntajeResultadoCombos,
    140
)

Por tanto:

LOS POSGRADOS NUNCA PUEDEN DAR MÁS DE 140 PUNTOS.

Incluso si un error de configuración o una combinación futura genera:

145
150
175
200

el motor final debe impedir reconocer más de:

140.

============================================================
9. ESPECIALIZACIÓN NORMAL SOLA
============================================================

Mantener la regla individual actual:

Especialización normal de 1–2 años:

hasta 20 puntos.

Más de 2 años:

hasta 10 puntos adicionales por cada año adicional.

Máximo:

30 puntos.

Por tanto una Especialización normal individual puede llegar hasta:

30 puntos.

Ejemplos:

1 año:
máximo 20.

2 años:
máximo 20.

3 años:
máximo 30.

4 años:
máximo 30.

5 años:
máximo 30.

============================================================
10. DOS ESPECIALIZACIONES NORMALES
============================================================

Si existen dos Especializaciones normales válidas:

el conjunto de Especializaciones normales no puede superar:

30 puntos.

No sumar:

30 + 30 = 60.

El máximo reconocido del bloque:

Especializaciones normales

es:

30 puntos.

Los títulos se ordenan cronológicamente.

Mantener ambos registros visibles.

Mostrar cuál parte de cada registro participa en el reconocimiento si fuese necesario.

============================================================
11. MAESTRÍA SOLA
============================================================

Una Maestría puede aportar:

hasta 40 puntos.

Mantener el tratamiento existente del concepto:

“hasta”.

============================================================
12. DOS MAESTRÍAS
============================================================

Si existen dos Maestrías válidas:

Primera Maestría cronológicamente:
hasta 40 puntos.

Segunda Maestría:
hasta 20 puntos adicionales.

Máximo conjunto:

60 puntos.

Por tanto:

Maestría 1:
40

Maestría 2:
20

Total:
60

Nunca:

40 + 40 = 80 reconocido.

============================================================
13. ESPECIALIZACIÓN NORMAL + MAESTRÍA
============================================================

Cuando el conjunto válido incluya:

Especialización normal
+
Maestría

aplicar el combo:

Especialización normal:
20 puntos.

Maestría:
40 puntos.

Máximo conjunto:

60 puntos.

IMPORTANTE:

Aunque la Especialización individual pudiera alcanzar 30 puntos cuando está sola, dentro de este combo su valor reconocido pasa a:

20.

Ejemplo:

Especialización de 3 años sola:
puede alcanzar 30.

La misma Especialización + Maestría:
Especialización = 20.
Maestría = 40.
Total = 60.

Esta modificación contextual del valor es intencional.

============================================================
14. ESPECIALIZACIONES + MAESTRÍAS — TOPE GENERAL
============================================================

Cuando existan múltiples Especializaciones normales y/o múltiples Maestrías sin Doctorado:

el bloque combinado:

Especializaciones + Maestrías

NO puede superar:

60 puntos.

Ejemplo:

Especialización
+
2 Maestrías

aunque individualmente pudieran generar más:

PUNTAJE RECONOCIDO TOTAL MÁXIMO:
60 puntos.

No permitir superar 60 mediante la acumulación de títulos.

El motor debe escoger internamente la distribución válida que maximice el puntaje reconocido respetando las reglas existentes.

============================================================
15. ESPECIALIZACIÓN NORMAL + MAESTRÍA + DOCTORADO
============================================================

Cuando existan:

Especialización normal
+
Maestría
+
Doctorado

aplicar:

Especialización:
20 puntos.

Maestría:
40 puntos.

Doctorado:
80 puntos.

Total:

140 puntos.

Este combo alcanza directamente el máximo global de posgrados.

No reconocer puntos adicionales de otros posgrados si el resultado ya alcanzó:

140.

Los títulos adicionales siguen visibles pero pueden quedar sin aporte reconocido.

============================================================
16. MAESTRÍA + DOCTORADO
============================================================

Por ahora utilizar la siguiente regla vigente en el prototipo:

Maestría:
hasta 40 puntos.

Doctorado:
hasta 80 puntos.

Máximo conjunto:

120 puntos.

IMPORTANTE:

Esta regla todavía puede ser revisada institucionalmente posteriormente.

Por tanto:

NO dispersar el valor 120 en múltiples componentes.

Centralizarlo como una constante/regla configurable del motor.

Ejemplo conceptual:

RULE_MASTERS_PLUS_DOCTORATE_MAX = 120

No escribir “120” repetidamente por toda la aplicación.

============================================================
17. MAESTRÍA + DOS DOCTORADOS
============================================================

Cuando existan:

1 Maestría válida
+
2 Doctorados válidos

ordenar los Doctorados cronológicamente.

Aplicar:

Maestría:
40 puntos.

Primer Doctorado:
80 puntos.

Segundo Doctorado:
20 puntos.

Total máximo:

140 puntos.

Resultado:

40 + 80 + 20 = 140.

No reconocer:

40 + 80 + 40.

No reconocer:

160.

============================================================
18. DOCTORADO SIN MAESTRÍA
============================================================

Cuando exista un Doctorado válido y NO exista Maestría reconocida:

Primer Doctorado:

hasta 120 puntos.

Mantener esta regla existente.

============================================================
19. DOS DOCTORADOS SIN MAESTRÍA
============================================================

Si existen:

2 Doctorados válidos

y NO existe Maestría reconocida:

Primer Doctorado cronológicamente:

hasta 120 puntos.

Segundo Doctorado:

hasta 20 puntos adicionales.

Máximo:

140 puntos.

Resultado máximo:

120 + 20 = 140.

No superar 140.

============================================================
20. ESPECIALIZACIÓN NORMAL + DOCTORADO SIN MAESTRÍA
============================================================

Cuando exista:

Especialización normal
+
Doctorado

y NO exista Maestría reconocida:

Especialización normal:

20 puntos.

Doctorado:

120 puntos.

Total:

140 puntos.

Este combo alcanza el máximo de posgrados.

No reconocer puntos adicionales por otros posgrados una vez alcanzado 140.

============================================================
21. ESPECIALIZACIÓN CLÍNICA SOLA
============================================================

Mantener por ahora la regla existente:

Especialización clínica en Medicina Humana
o
Especialización clínica en Odontología:

15 puntos por año.

Máximo individual reconocido:

75 puntos.

Ejemplos:

1 año:
15.

2 años:
30.

3 años:
45.

4 años:
60.

5 años:
75.

6 años:
75.

IMPORTANTE:

Esta regla se encuentra actualmente aceptada para esta versión del prototipo, aunque podrá ser revisada posteriormente.

Centralizar el tope:

CLINICAL_SPECIALIZATION_MAX = 75

No dispersarlo.

============================================================
22. SOLO UNA ESPECIALIZACIÓN CLÍNICA ES RECONOCIBLE
============================================================

Si el docente registra más de una Especialización clínica:

SOLO UNA puede aportar puntaje reconocido.

Utilizar el orden CRONOLÓGICO.

La primera Especialización clínica válida cronológicamente:

puede aportar puntaje.

Las Especializaciones clínicas adicionales:

deben permanecer visibles;
NO deben eliminarse;
NO deben desaparecer;
NO deben sumar al puntaje reconocido.

Mostrar visualmente el puntaje de las adicionales de forma diferenciada.

Ejemplo:

Especialización clínica 1
Medicina Humana
45 puntos reconocidos

Especialización clínica 2
Odontología
30 puntos calculados
0 puntos reconocidos

Utilizar un color secundario/neutro o estilo visual diferente para dejar claro:

“Registrado, pero no reconocido en la sumatoria.”

NO utilizar rojo si no se trata de un error.

Puede mostrarse:

“0 puntos reconocidos — título adicional no acumulable”

o equivalente.

============================================================
23. ESPECIALIZACIÓN NORMAL + ESPECIALIZACIÓN CLÍNICA
============================================================

Cuando exista:

Especialización normal
+
Especialización clínica

aplicar:

Especialización normal:
hasta 20 puntos dentro de este combo.

Especialización clínica:
15 puntos por año.

Pero el máximo CONJUNTO del combo es:

60 puntos.

Ejemplo:

Especialización normal:
20.

Especialización clínica de 2 años:
30.

Total:
50.

Reconocido:
50.

Otro ejemplo:

Especialización normal:
20.

Especialización clínica de 4 años:
60.

Bruto del combo:
80.

Tope del combo:
60.

Reconocido:
60.

IMPORTANTE:

La Especialización clínica sola puede actualmente llegar a 75.

Sin embargo, al combinarse con Especialización normal, este combo tiene por ahora un máximo de:

60.

Esta regla puede parecer contraintuitiva, pero debe implementarse exactamente así en esta versión.

MARCAR ESTA REGLA COMO CONFIGURABLE.

No alterar otras reglas intentando “corregirla”.

============================================================
24. MAESTRÍA + ESPECIALIZACIÓN CLÍNICA
============================================================

Cuando exista:

Maestría
+
Especialización clínica

aplicar:

Maestría:
hasta 40 puntos.

Especialización clínica:
15 puntos por año.

Tope CONJUNTO:

60 puntos.

Ejemplo:

Maestría:
40.

Clínica 1 año:
15.

Total:
55.

Reconocido:
55.

Otro ejemplo:

Maestría:
40.

Clínica 2 años:
30.

Bruto:
70.

Tope combo:
60.

Reconocido:
60.

Esta regla también debe centralizarse porque puede revisarse posteriormente.

============================================================
25. COMBOS Y ESPECIALIZACIONES CLÍNICAS ADICIONALES
============================================================

Si existe más de una especialización clínica:

solo la primera cronológicamente reconocible debe entrar en el motor de combos.

Las demás:

puntajeCalculado:
puede mostrarse.

puntajeReconocido:
0.

NO utilizarlas para intentar formar otro combo que aumente el puntaje.

============================================================
26. ALGORITMO GENERAL DEL MOTOR
============================================================

Reemplazar la sumatoria anterior por una función central equivalente conceptualmente a:

calcularPuntajeFormacion(expediente)

Esta función debe ejecutar aproximadamente las siguientes fases:

FASE 1
Obtener todos los títulos.

FASE 2
Separar:

pregrados

posgrados

FASE 3
Filtrar únicamente títulos reconocibles.

FASE 4
Ordenar títulos del mismo nivel cronológicamente.

FASE 5
Calcular puntaje individual/base de cada título.

FASE 6
Identificar tipos presentes:

- especialización normal;
- especialización clínica;
- maestría;
- doctorado.

FASE 7
Identificar todos los combos normativamente/configuradamente posibles.

FASE 8
Evaluar el puntaje reconocido de cada combo.

FASE 9
Escoger el combo válido que produzca mayor reconocimiento.

FASE 10
Aplicar el tope específico del combo.

FASE 11
Aplicar:

posgrados <= 140.

FASE 12
Aplicar:

pregrado <= 183.

FASE 13
Calcular:

totalFormacion =
pregradoReconocido
+
posgradoReconocido.

FASE 14
Generar un desglose explicativo.

============================================================
27. NO UTILIZAR UNA SIMPLE SUMA
============================================================

ELIMINAR cualquier lógica equivalente a:

totalPosgrados =
especializaciones.reduce(...)
+
maestrias.reduce(...)
+
doctorados.reduce(...)

si dicha lógica suma títulos independientemente sin evaluar combos.

NO corregir simplemente con:

Math.min(totalPosgrados, 140)

porque eso NO resuelve los valores contextuales.

Ejemplo:

Especialización de 3 años:
30

Maestría:
40

Suma simple:
70

Math.min(70,140):
70

ESTO SIGUE SIENDO INCORRECTO.

El combo correcto es:

Especialización:
20

Maestría:
40

Total:
60.

Por tanto:

PRIMERO:
resolver el combo.

DESPUÉS:
aplicar el tope global.

============================================================
28. RESULTADO DETALLADO DEL MOTOR
============================================================

La función central debería devolver conceptualmente información como:

{
    pregrado: {
        bruto: 183,
        reconocido: 183,
        tope: 183
    },

    posgrados: {
        comboAplicado: "Especialización + Maestría + Doctorado",
        bruto: 150,
        topeCombo: 140,
        topeGlobal: 140,
        reconocido: 140
    },

    desglose: [
        {
            titulo: "...",
            tipo: "Especialización",
            baseIndividual: 30,
            valorCombo: 20,
            reconocido: 20
        },
        {
            titulo: "...",
            tipo: "Maestría",
            baseIndividual: 40,
            valorCombo: 40,
            reconocido: 40
        },
        {
            titulo: "...",
            tipo: "Doctorado",
            baseIndividual: 80,
            valorCombo: 80,
            reconocido: 80
        }
    ],

    totalFormacion: 323
}

Adaptar esta estructura al código existente.

No es obligatorio utilizar exactamente estos nombres.

Lo obligatorio es conservar conceptualmente:

- valor individual;
- valor ajustado por combo;
- tope;
- valor reconocido;
- total final.

============================================================
29. DESGLOSE VISIBLE PARA CONTROL DEL EVALUADOR
============================================================

El evaluador debe poder consultar cómo se calculó el subtotal de Formación académica.

NO rediseñar toda la pantalla.

Agregar únicamente el detalle necesario dentro del resumen existente o mediante una sección desplegable compacta.

Mostrar algo como:

“Cálculo aplicado”

Combo aplicado:
Especialización + Maestría + Doctorado

Especialización:
20 puntos

Maestría:
40 puntos

Doctorado:
80 puntos

Subtotal bruto/reconocido:
140 puntos

Tope de posgrados:
140 puntos

Puntaje reconocido:
140 puntos

Pregrado:
183 puntos

Total Formación académica:
323 puntos

Cuando exista reducción por tope:

Puntaje calculado:
155

Tope aplicable:
140

Puntaje reconocido:
140

Debe quedar comprensible por qué el sistema no reconoce 155.

============================================================
30. RECÁLCULO AUTOMÁTICO
============================================================

Recalcular TODO el bloque de Formación académica cuando ocurra cualquiera de estas acciones:

- agregar un título;
- editar un título;
- eliminar un título;
- cambiar nivel de formación;
- cambiar subtipo;
- cambiar duración;
- cambiar Medicina Humana / Composición Musical;
- cambiar Especialización general / clínica;
- cambiar área clínica;
- agregar una Maestría;
- eliminar una Maestría;
- agregar un Doctorado;
- eliminar un Doctorado;
- cambiar estado de convalidación;
- aprobar/validar un título;
- dejar un título pendiente;
- cambiar fecha de finalización;
- cualquier cambio que altere el orden cronológico.

NO exigir:

botón “Recalcular”.

El recálculo debe ser automático.

============================================================
31. EJEMPLO DE RECÁLCULO AL AGREGAR MAESTRÍA
============================================================

Estado inicial:

Especialización normal de 3 años.

Puntaje:
30.

Luego el usuario agrega:

Maestría.

El sistema NO debe mantener:

30 + 40 = 70.

Debe reevaluar el conjunto completo.

Nuevo combo:

Especialización + Maestría.

Especialización:
20.

Maestría:
40.

Total:
60.

Por tanto el puntaje de la Especialización cambia automáticamente:

30
→ 20.

============================================================
32. EJEMPLO DE RECÁLCULO AL AGREGAR DOCTORADO
============================================================

Estado:

Especialización:
20.

Maestría:
40.

Total:
60.

Agregar:

Doctorado.

Reevaluar:

Especialización + Maestría + Doctorado.

Resultado:

20
+
40
+
80
=
140.

No mantener cálculos anteriores de forma independiente.

============================================================
33. EJEMPLO DE RECÁLCULO POR CONVALIDACIÓN
============================================================

Estado:

Maestría válida:
40.

Doctorado extranjero:
Pendiente de convalidación.

Resultado reconocido:

40.

El Doctorado permanece visible:

0 reconocido / pendiente.

Posteriormente:

Doctorado:
Convalidado.

El sistema debe recalcular automáticamente.

Nuevo combo:

Maestría + Doctorado.

Resultado provisional actual:

40 + 80 = 120.

============================================================
34. CONFIGURACIÓN CENTRAL DE REGLAS
============================================================

Centralizar los valores en una configuración del motor.

Ejemplo conceptual:

FORMATION_RULES = {

    PREGRADO_MAX: 183,

    POSTGRADO_GLOBAL_MAX: 140,

    ESPECIALIZACION_NORMAL_MAX: 30,

    ESPECIALIZACION_MAESTRIA_MAX: 60,

    ESPECIALIZACIONES_MAESTRIAS_MAX: 60,

    CLINICAL_SINGLE_MAX: 75,

    NORMAL_PLUS_CLINICAL_MAX: 60,

    MASTERS_PLUS_CLINICAL_MAX: 60,

    MASTERS_MAX: 40,

    TWO_MASTERS_MAX: 60,

    MASTERS_PLUS_DOCTORATE_MAX: 120,

    TWO_DOCTORATES_NO_MASTERS_MAX: 140,

    MASTERS_TWO_DOCTORATES_MAX: 140,

    POSTGRADO_MAX: 140
}

Adaptarlo a la arquitectura existente.

No es obligatorio utilizar exactamente este objeto.

Sí es obligatorio evitar reglas repetidas/hardcodeadas en diferentes componentes.

============================================================
35. REGLAS PROVISIONALES
============================================================

Estas reglas deben implementarse actualmente pero quedar CENTRALIZADAS porque todavía pueden sufrir ajustes institucionales:

A.

Maestría + Doctorado
→ máximo actual 120.

B.

Especialización clínica sola
→ máximo actual 75.

C.

Especialización normal + Especialización clínica
→ máximo actual 60.

D.

Maestría + Especialización clínica
→ máximo actual 60.

NO eliminar estas reglas.

NO cambiarlas por criterio propio.

Simplemente implementarlas como reglas fácilmente modificables posteriormente.

============================================================
36. PRIORIDAD ENTRE REGLAS
============================================================

No aplicar simultáneamente múltiples combos sobre los mismos títulos.

Un mismo título NO puede aportar puntos dos veces.

Ejemplo:

Especialización
+
Maestría
+
Doctorado

NO calcular:

Especialización + Maestría = 60

y además:

Maestría + Doctorado = 120

y sumar:

180.

Eso es absolutamente incorrecto.

Los mismos títulos deben formar parte de UNA solución global de reconocimiento.

Cada título puede aportar como máximo una vez.

============================================================
37. TÍTULOS QUE NO APORTAN POR TOPE
============================================================

Cuando el conjunto alcance el máximo:

140 puntos de posgrado

los títulos adicionales deben seguir apareciendo.

NO eliminarlos.

NO ocultarlos.

Mostrar:

puntaje calculado individualmente

pero:

puntaje reconocido adicional:
0

Motivo:

“Tope máximo de posgrados alcanzado.”

Usar estilo visual neutro/secundario.

No mostrar rojo si no existe error.

============================================================
38. COLOR PARA PUNTAJE NO RECONOCIDO
============================================================

Cuando un título tenga puntaje calculado pero no pueda aportar por:

- ser una segunda especialización clínica no acumulable;
- haber alcanzado el tope;
- quedar fuera del combo seleccionado;

mostrar su puntaje calculado en un color secundario/neutro.

Ejemplo:

“30 puntos calculados”

y debajo:

“0 puntos reconocidos”

con una explicación discreta.

No usar el mismo color visual que un puntaje reconocido.

No utilizar rojo salvo que exista un error.

============================================================
39. NO MODIFICAR DATOS DE LOS TÍTULOS
============================================================

El motor de combos solo modifica:

PUNTAJE RECONOCIDO.

NO debe modificar:

- nombre del título;
- institución;
- duración;
- fechas;
- soportes;
- país;
- convalidación;
- área;
- tipo;
- información documental.

Ejemplo:

Una Especialización que individualmente calcula 30 y dentro de un combo reconoce 20:

debe conservar:

puntajeIndividual = 30

puntajeReconocidoCombo = 20

NO sobrescribir permanentemente:

puntajeIndividual = 20.

============================================================
40. PRUEBAS OBLIGATORIAS
============================================================

Antes de considerar terminada esta modificación, verificar TODOS estos casos.

-----------------------------------------
TEST 01 — PREGRADO GENERAL
-----------------------------------------

Pregrado general.

Resultado:

178.

-----------------------------------------
TEST 02 — PREGRADO ESPECIAL
-----------------------------------------

Medicina Humana.

Resultado:

183.

-----------------------------------------
TEST 03 — TOPE PREGRADO
-----------------------------------------

Múltiples pregrados.

Resultado reconocido de Pregrado:

nunca > 183.

-----------------------------------------
TEST 04 — ESPECIALIZACIÓN SOLA
-----------------------------------------

Especialización normal 3 años.

Resultado individual:

30.

-----------------------------------------
TEST 05 — DOS ESPECIALIZACIONES
-----------------------------------------

2 Especializaciones normales.

Resultado conjunto:

máximo 30.

-----------------------------------------
TEST 06 — MAESTRÍA SOLA
-----------------------------------------

1 Maestría.

Resultado:

hasta 40.

-----------------------------------------
TEST 07 — DOS MAESTRÍAS
-----------------------------------------

Maestría 1:
40.

Maestría 2:
20.

Total:

60.

-----------------------------------------
TEST 08 — ESPECIALIZACIÓN + MAESTRÍA
-----------------------------------------

Especialización que sola valía 30
+
Maestría 40.

Resultado:

Especialización reconocida:
20.

Maestría:
40.

Total:

60.

NO 70.

-----------------------------------------
TEST 09 — ESPECIALIZACIÓN + 2 MAESTRÍAS
-----------------------------------------

Resultado máximo:

60.

-----------------------------------------
TEST 10 — ESPECIALIZACIÓN + MAESTRÍA + DOCTORADO
-----------------------------------------

Resultado:

20 + 40 + 80 = 140.

-----------------------------------------
TEST 11 — MAESTRÍA + DOCTORADO
-----------------------------------------

Resultado actual:

40 + 80 = 120.

-----------------------------------------
TEST 12 — MAESTRÍA + 2 DOCTORADOS
-----------------------------------------

Resultado:

Maestría:
40.

Doctorado 1:
80.

Doctorado 2:
20.

Total:
140.

-----------------------------------------
TEST 13 — DOCTORADO SIN MAESTRÍA
-----------------------------------------

Primer Doctorado:

hasta 120.

-----------------------------------------
TEST 14 — DOS DOCTORADOS SIN MAESTRÍA
-----------------------------------------

Doctorado 1:
120.

Doctorado 2:
20.

Total:

140.

-----------------------------------------
TEST 15 — ESPECIALIZACIÓN + DOCTORADO SIN MAESTRÍA
-----------------------------------------

Especialización:
20.

Doctorado:
120.

Total:

140.

-----------------------------------------
TEST 16 — CLÍNICA SOLA
-----------------------------------------

Especialización clínica 4 años.

Resultado:

60.

-----------------------------------------
TEST 17 — CLÍNICA SOLA 5 AÑOS
-----------------------------------------

Resultado:

75.

-----------------------------------------
TEST 18 — CLÍNICA SOLA 7 AÑOS
-----------------------------------------

Resultado:

75 máximo.

-----------------------------------------
TEST 19 — DOS CLÍNICAS
-----------------------------------------

Clínica 1:
válida y primera cronológicamente.

Clínica 2:
válida pero adicional.

Resultado:

Clínica 1:
reconocida.

Clínica 2:
0 reconocidos.

Clínica 2 permanece visible con estilo secundario.

-----------------------------------------
TEST 20 — ESPECIALIZACIÓN NORMAL + CLÍNICA
-----------------------------------------

Normal:
20.

Clínica 4 años:
60 individual.

Bruto:
80.

Tope combo:

60.

Reconocido:

60.

-----------------------------------------
TEST 21 — MAESTRÍA + CLÍNICA
-----------------------------------------

Maestría:
40.

Clínica 2 años:
30.

Bruto:

70.

Tope combo:

60.

Reconocido:

60.

-----------------------------------------
TEST 22 — TOPE GLOBAL POSGRADOS
-----------------------------------------

Crear un conjunto cuyo bruto exceda:

140.

Resultado:

puntaje bruto:
>140.

puntaje reconocido:

140.

Nunca más.

-----------------------------------------
TEST 23 — TOTAL MÁXIMO DE FORMACIÓN
-----------------------------------------

Pregrado Medicina Humana:

183.

Posgrados reconocidos:

140.

Resultado:

Total Formación académica:

323.

-----------------------------------------
TEST 24 — PENDIENTE DE CONVALIDACIÓN
-----------------------------------------

Maestría válida:
40.

Doctorado internacional no convalidado.

Resultado:

solo 40 reconocidos.

Doctorado:
visible, pendiente, sin participar en combo.

-----------------------------------------
TEST 25 — CONVALIDACIÓN POSTERIOR
-----------------------------------------

Cambiar Doctorado:

Pendiente
→ Convalidado.

Resultado:

recalcular automáticamente.

Combo nuevo:

Maestría + Doctorado.

Resultado actual:

120.

-----------------------------------------
TEST 26 — ORDEN CRONOLÓGICO
-----------------------------------------

Registrar primero un Doctorado de 2025.

Después registrar otro Doctorado de 2020.

El sistema debe interpretar:

Doctorado 2020:
primer Doctorado.

Doctorado 2025:
segundo Doctorado.

NO utilizar el orden de digitación.

-----------------------------------------
TEST 27 — ELIMINAR TÍTULO
-----------------------------------------

Combo:

Especialización + Maestría + Doctorado
= 140.

Eliminar Doctorado.

Resultado automático:

Especialización + Maestría
= 60.

-----------------------------------------
TEST 28 — NO DUPLICAR TÍTULOS ENTRE COMBOS
-----------------------------------------

Especialización + Maestría + Doctorado.

Verificar que ningún título participe en dos combos simultáneamente.

Resultado:

140.

NO 180.
NO 200.
NO 260.

============================================================
41. CRITERIO ESTRICTO DE FINALIZACIÓN
============================================================

NO des por terminado este cambio únicamente porque agregaste:

Math.min(total, 140)

Eso NO es suficiente.

La modificación se considera terminada únicamente cuando:

1. Pregrado se calcula separadamente.

2. Pregrado nunca supera 183.

3. Posgrados nunca superan 140.

4. La Especialización puede cambiar de valor según el combo.

5. Especialización + Maestría produce 60 y no 70.

6. Especialización + Maestría + Doctorado produce 140.

7. Dos Maestrías producen máximo 60.

8. Maestría + 2 Doctorados produce 140 con distribución 40/80/20.

9. Dos Doctorados sin Maestría producen máximo 140.

10. Especialización + Doctorado sin Maestría produce 140.

11. Solo una Especialización clínica aporta.

12. Títulos adicionales permanecen visibles aunque reconozcan 0.

13. Los títulos pendientes de convalidación no participan.

14. Al validarse un título se recalcula el combo.

15. El orden entre títulos del mismo nivel es cronológico.

16. El usuario puede consultar el combo aplicado.

17. Se diferencia puntaje bruto de reconocido.

18. El cálculo completo se actualiza automáticamente.

19. No se modificó ninguna lógica fuera de Formación académica.

20. Existe UNA SOLA función/motor central de sumatoria de Formación académica.

============================================================
42. RESTRICCIONES FINALES — NO HACER
============================================================

NO modificar otros módulos.

NO cambiar Experiencia calificada.

NO cambiar Productividad académica.

NO cambiar Categoría docente.

NO cambiar login.

NO cambiar dashboard.

NO cambiar navegación.

NO cambiar exportaciones.

NO cambiar el diseño general.

NO rehacer Formación académica visualmente.

NO eliminar títulos para cumplir topes.

NO ocultar títulos sin puntaje reconocido.

NO sumar títulos pendientes.

NO sumar títulos no convalidados.

NO utilizar orden de digitación.

NO sumar cada posgrado de forma independiente.

NO limitar simplemente al final con Math.min sin resolver combos.

NO permitir que un mismo título aporte dos veces.

NO superar 183 en Pregrado.

NO superar 140 en Posgrado.

NO aplicar 140 al total completo de Formación académica.

NO impedir que Formación llegue hasta 323 cuando corresponda:

183 Pregrado
+
140 Posgrado
=
323.

NO cambiar reglas provisionales por criterio propio.

NO intentar “corregir” reglas que parezcan poco intuitivas.

IMPLEMÉNTALAS COMO ESTÁN DEFINIDAS.

============================================================
43. RESULTADO ESPERADO
============================================================

Al finalizar esta iteración, el sistema debe conservar exactamente el mismo producto y experiencia actual, pero el cálculo de Formación académica debe utilizar un MOTOR DE COMBINACIONES Y TOPES real.

El sistema debe ser capaz de explicar:

qué títulos tiene el docente;

cuáles son reconocibles;

qué valor individual tendría cada uno;

qué combo se aplicó;

cómo cambió el valor de cada título dentro del combo;

qué tope específico se aplicó;

si fue necesario aplicar el máximo global de 140;

cuál es el puntaje final de posgrados;

cuál es el puntaje del pregrado;

y cuál es finalmente:

TOTAL FORMACIÓN ACADÉMICA.

IMPLEMENTA ESTA CORRECCIÓN DIRECTAMENTE SOBRE EL CÓDIGO EXISTENTE.

NO RECONSTRUYAS EL PROYECTO.

NO CAMBIES NADA FUERA DE LA LÓGICA DE SUMATORIA Y TOPES DE FORMACIÓN ACADÉMICA.