PROMPT MASTER — RECONSTRUCCIÓN DEL MOTOR DE PUNTAJES DE FORMACIÓN ACADÉMICA
FIGMA MAKE — MODIFICAR ÚNICAMENTE LA LÓGICA EXISTENTE

PROYECTO:
“Registro, validación y valoración”
Universidad Militar Nueva Granada

============================================================
0. OBJETIVO DE ESTA ITERACIÓN
============================================================

Trabaja SOBRE EL CÓDIGO Y EL PRODUCTO EXISTENTES.

NO reconstruyas la aplicación.

NO modifiques funcionalidades que no estén relacionadas con el cálculo de Formación académica.

NO cambies:

- Dashboard.
- Login.
- Sidebar.
- Navegación.
- Wizard.
- Experiencia calificada.
- Productividad académica.
- Categoría docente.
- Exportaciones.
- Autenticación.
- Estados generales del expediente.
- Formularios que no pertenezcan a Formación académica.
- Diseño general.
- Paleta.
- Tipografía.
- Estructura visual global.
- Lógica documental existente.
- Lógica de soportes.
- Lógica de convalidación, excepto su efecto sobre si un título participa o no en los cálculos.

ESTA ITERACIÓN MODIFICA EXCLUSIVAMENTE:

1. cálculo individual de posgrados cuando corresponda;
2. sumatoria de posgrados;
3. agrupación por tipo de posgrado;
4. topes máximos;
5. combinaciones entre tipos de posgrado;
6. relevancia de títulos según fecha;
7. distribución entre puntaje potencial y reconocido;
8. feedback visual del cálculo de Formación académica.

La lógica actual de sumatoria de Formación académica debe ser REEMPLAZADA por un único motor centralizado.

NO agregues esta nueva lógica encima de una función vieja.

Debe existir UNA SOLA FUENTE DE VERDAD para el puntaje final de Formación académica.

============================================================
1. PRINCIPIO GENERAL
============================================================

Separar siempre:

A. PREGRADO

B. POSGRADO

PREGRADO:

Máximo reconocido:
183 puntos.

POSGRADO:

Máximo global reconocido:
140 puntos.

Por tanto:

puntajeTotalFormacion =
puntajePregradoReconocido
+
puntajePosgradoReconocido

con:

puntajePregradoReconocido <= 183

puntajePosgradoReconocido <= 140

Máximo teórico del apartado completo:

183 + 140 = 323 puntos.

IMPORTANTE:

NO limitar toda Formación académica a 140.

Los 140 corresponden únicamente a POSGRADOS.

============================================================
2. PREGRADO
============================================================

NO modificar la lógica de pregrado ya existente.

Mantener:

Pregrado general:
178 puntos.

Medicina Humana:
183 puntos.

Composición Musical:
183 puntos.

Máximo del bloque de Pregrado:

183 puntos.

La nueva lógica de combos descrita a continuación corresponde principalmente a POSGRADOS.

============================================================
3. TÍTULOS QUE PUEDEN PARTICIPAR
============================================================

Solo participan en el motor de puntaje los títulos que estén:

- completos;
- validados;
- convalidados cuando hayan sido obtenidos en el exterior;
- habilitados para reconocimiento conforme a la lógica actual.

NO participan todavía:

- títulos incompletos;
- pendientes de convalidación;
- pendientes de validación;
- títulos que no puedan ser reconocidos;
- registros inválidos.

Estos títulos NO deben eliminarse.

Deben permanecer visibles.

Pueden mostrar:

“Puntaje potencial”

pero:

“Puntaje reconocido = 0”

hasta que cumplan los requisitos.

Cuando posteriormente pasen a estado válido:

RECALCULAR automáticamente TODO el bloque de Formación académica.

============================================================
4. GRUPOS DE POSGRADO
============================================================

Clasificar los títulos reconocibles en exactamente estos grupos:

GRUPO 1
Especialización normal

GRUPO 2
Maestría / Magíster

GRUPO 3
Especialización clínica en Medicina Humana u Odontología

GRUPO 4
Doctorado / Ph.D.

Orden conceptual de importancia:

Especialización normal
<
Maestría
<
Especialización clínica
<
Doctorado

Este orden se utiliza como referencia para:

- determinar el nivel superior presente;
- resolver combinaciones no ambiguas;
- ordenar visualmente el resumen;
- comprender qué tope tiene mayor jerarquía.

Pero:

LAS REGLAS ESPECÍFICAS DE COMBINACIÓN DEFINIDAS MÁS ADELANTE TIENEN PRIORIDAD.

============================================================
5. TOPES BASE POR GRUPO
============================================================

ESPECIALIZACIONES NORMALES

Máximo acumulable entre todas:
30 puntos.


MAESTRÍAS

Máximo acumulable entre todas:
60 puntos.


ESPECIALIZACIONES CLÍNICAS

Máximo acumulable entre todas:
75 puntos.


DOCTORADOS

Máximo potencial del bloque:
140 puntos,

pero sus valores dependen de las reglas específicas de Doctorado y de las combinaciones existentes.

============================================================
6. PRINCIPIO DE PUNTAJE POTENCIAL VS. RECONOCIDO
============================================================

Cada título debe poder conservar conceptualmente:

puntajePotencial

puntajeReconocido

motivoDeAjuste

Ejemplo:

Especialización clínica:
45 puntos potenciales.

Después de aplicar tope:
15 puntos reconocidos.

NO sobrescribir permanentemente:

45 → 15

como si el título individual valiera solamente 15.

Conservar:

puntajePotencial = 45

puntajeReconocido = 15

============================================================
7. FECHA Y RELEVANCIA
============================================================

La fecha de finalización del título SÍ importa.

Los títulos más recientes se consideran más relevantes cuando sea necesario:

- elegir entre varios títulos equivalentes;
- seleccionar cuáles participan cuando existe un límite de cantidad;
- decidir dónde aplicar una reducción por tope.

Pero:

un título antiguo NO desaparece automáticamente.

NO significa que un título antiguo valga siempre 0.

La fecha funciona como criterio de RELEVANCIA y desempate.

Cuando haya que reducir puntaje porque se excede un tope:

PRIORIDAD GENERAL:

1. conservar en mayor medida los títulos más recientes;
2. reducir primero el puntaje reconocido de los títulos más antiguos;
3. nunca modificar el puntaje potencial del título;
4. mantener todos los títulos visibles.

IMPORTANTE:

Esta regla de recencia NO puede alterar las distribuciones explícitamente establecidas por un combo.

Las reglas explícitas de combinación tienen prioridad.

============================================================
8. DESEMPATE POR FECHA
============================================================

Si dos títulos tienen exactamente la misma fecha de finalización:

utilizar un criterio interno estable únicamente como desempate técnico.

Puede utilizarse:

orden de creación del registro.

Pero:

NO convertir el orden de digitación en regla normativa.

La columna “Primer título / Título adicional” de la tabla suministrada se utiliza únicamente para explicar la distribución.

NO significa necesariamente orden cronológico.

============================================================
9. ESPECIALIZACIÓN NORMAL
============================================================

Mantener la lógica individual:

Especialización general de 1 a 2 años:

hasta 20 puntos.

Especialización de más de 2 años:

+10 puntos por año adicional.

Máximo individual:

30 puntos.

Ejemplos:

1 año:
hasta 20.

2 años:
hasta 20.

3 años:
hasta 30.

4 años:
máximo 30.

5 años:
máximo 30.

============================================================
10. MÚLTIPLES ESPECIALIZACIONES NORMALES
============================================================

La suma de TODAS las Especializaciones normales reconocibles:

NO puede superar:

30 puntos.

Ejemplo:

Especialización A:
20 potenciales.

Especialización B:
20 potenciales.

Bruto:
40.

Reconocido como grupo:
30.

Ambas permanecen visibles.

El grupo debe mostrar:

Puntaje bruto:
40

Tope:
30

Puntaje reconocido:
30

Si hay que distribuir la reducción entre títulos:

dar prioridad a los más recientes.

============================================================
11. MAESTRÍA
============================================================

Una Maestría puede aportar:

hasta 40 puntos.

============================================================
12. DOS MAESTRÍAS
============================================================

Con dos Maestrías válidas:

Primera asignación:
hasta 40.

Título adicional:
hasta 20.

Máximo conjunto:

60 puntos.

Ejemplo:

Maestría A:
40.

Maestría B:
20.

Total:
60.

============================================================
13. TRES MAESTRÍAS
============================================================

Si existen exactamente 3 Maestrías válidas:

el máximo del grupo continúa siendo:

60 puntos.

Distribuir esos 60 puntos entre las 3 Maestrías.

Resultado máximo:

20 + 20 + 20 = 60.

No permitir:

40 + 20 + 20 = 80.

No permitir que el grupo supere 60.

============================================================
14. MÁS DE TRES MAESTRÍAS
============================================================

Si el sistema permite registrar más de 3 Maestrías:

mantener el mismo principio:

TOTAL DEL GRUPO <= 60.

Distribuir el máximo reconocido entre las Maestrías que puedan participar.

La distribución debe conservar:

- puntaje potencial;
- puntaje reconocido;
- fecha;
- relevancia.

Ninguna cantidad de Maestrías puede superar:

60 puntos reconocidos.

============================================================
15. ESPECIALIZACIONES CLÍNICAS
============================================================

Aplicar exclusivamente a:

Especialización clínica en Medicina Humana

o

Especialización clínica en Odontología.

Puntaje:

15 puntos por cada AÑO COMPLETO.

NO utilizar fracciones de año.

NO calcular:

2.5 × 15.

Solo años enteros completos.

La duración se obtiene de:

DURACIÓN DECLARADA MANUALMENTE.

Ejemplo:

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

Máximo:

75 puntos.

============================================================
16. MÚLTIPLES ESPECIALIZACIONES CLÍNICAS
============================================================

Sí se pueden sumar varias Especializaciones clínicas.

Pero:

la suma de TODAS las Especializaciones clínicas nunca puede superar:

75 puntos.

Ejemplo:

Clínica A:
2 años = 30.

Clínica B:
3 años = 45.

Total:
75.

Otro:

Clínica A:
3 años = 45.

Clínica B:
4 años = 60.

Bruto:
105.

Tope:
75.

Reconocido:
75.

Ambas permanecen visibles.

Si es necesario reducir el reconocimiento:

conservar prioritariamente el puntaje de la Especialización clínica más reciente.

Ejemplo:

2025 clínica:
60 potenciales.

2020 clínica:
45 potenciales.

Tope:
75.

Una distribución válida siguiendo relevancia sería:

Clínica 2025:
60 reconocidos.

Clínica 2020:
15 reconocidos.

Total:
75.

============================================================
17. DOCTORADO CON MAESTRÍA RECONOCIDA
============================================================

Si existe una Maestría reconocida y existe un Doctorado:

Doctorado:

hasta 80 puntos.

Maestría:

hasta 40 puntos.

Combo:

Maestría + Doctorado

Máximo conjunto actual:

120 puntos.

Ejemplo máximo:

40 + 80 = 120.

Esta regla tiene prioridad sobre una simple suma de topes de grupos.

============================================================
18. DOCTORADO SIN MAESTRÍA
============================================================

Si existe un Doctorado y NO existe Maestría reconocida:

Doctorado:

hasta 120 puntos.

============================================================
19. DOS DOCTORADOS SIN MAESTRÍA
============================================================

Si existen 2 Doctorados reconocibles y NO existe ninguna Maestría reconocida:

Doctorado principal:
hasta 120.

Doctorado adicional:
hasta 20.

Máximo:

140 puntos.

Resultado máximo:

120 + 20 = 140.

============================================================
20. DOS DOCTORADOS — REGLA GENERAL DE LA TABLA
============================================================

Cuando corresponda aplicar la regla general:

2 Doctorados:

primer componente:
hasta 80.

título adicional:
hasta 40.

Máximo conjunto:

120 puntos.

NO superar 120 bajo esta regla.

============================================================
21. MAESTRÍA + DOS DOCTORADOS
============================================================

Si existen:

1 o más Maestrías reconocibles
+
2 Doctorados reconocibles

aplicar la regla específica:

Maestría:
40 puntos.

Doctorado principal:
80 puntos.

Doctorado adicional:
20 puntos.

Máximo conjunto:

140 puntos.

Resultado:

40 + 80 + 20 = 140.

Esta regla específica tiene prioridad sobre:

2 Doctorados = 120.

============================================================
22. TRES O MÁS DOCTORADOS
============================================================

Si existen 3 o más Doctorados:

solo se reconocerán 2 para la combinación principal.

Seleccionar los 2 Doctorados que:

1. produzcan mayor puntaje potencial válido;
2. en caso de empate, sean los más recientes por fecha de finalización.

Los demás Doctorados:

- permanecen visibles;
- conservan su puntaje potencial;
- tienen 0 puntos reconocidos dentro de esa combinación.

Mostrar motivo:

“No participa en el reconocimiento por límite de títulos de Doctorado.”

NO eliminar el registro.

============================================================
23. ESPECIALIZACIÓN NORMAL + MAESTRÍA
============================================================

Aplicar:

Especialización normal:
hasta 20 dentro de este combo.

Maestría:
hasta 40.

Máximo conjunto:

60 puntos.

Ejemplo:

Especialización que individualmente podía valer:
30.

Al combinarse con Maestría:

Especialización reconocida:
20.

Maestría:
40.

Total:
60.

NO calcular:

30 + 40 = 70.

============================================================
24. VARIAS ESPECIALIZACIONES + MAESTRÍA
============================================================

Aunque las Especializaciones normales como grupo puedan sumar hasta 30:

al combinarse con Maestría:

el resultado total de:

Especializaciones normales
+
Maestrías

NO puede superar:

60 puntos.

Ejemplo conceptual:

Especializaciones:
30.

Maestrías:
60.

Bruto:
90.

Tope por nivel superior presente:
60.

Reconocido:
60.

NO superar 60.

============================================================
25. ESPECIALIZACIÓN NORMAL + MAESTRÍA + DOCTORADO
============================================================

Aplicar exactamente:

Especialización normal:
20.

Maestría:
40.

Doctorado:
80.

Total:

140 puntos.

No importa el orden de digitación.

No importa cuál se registró primero.

La combinación máxima es:

140.

============================================================
26. ESPECIALIZACIÓN NORMAL + DOCTORADO SIN MAESTRÍA
============================================================

Si existe:

Especialización normal
+
Doctorado
+
NO existe Maestría reconocida

aplicar:

Especialización:
20.

Doctorado:
120.

Total:

140.

============================================================
27. ESPECIALIZACIÓN NORMAL + ESPECIALIZACIÓN CLÍNICA
============================================================

CORRECCIÓN IMPORTANTE:

La versión anterior utilizaba máximo 60.

YA NO UTILIZAR 60.

El nuevo máximo de esta combinación es:

75 puntos.

La lógica debe seguir el principio:

Especialización normal
+
Especialización clínica
→ nivel superior = Especialización clínica
→ máximo reconocido = 75.

La Especialización normal NO elimina la clínica.

La clínica NO elimina la Especialización normal.

Ambas permanecen reconocibles dentro del límite.

Ejemplo:

Especialización normal:
20.

Especialización clínica:
45.

Total:
65.

Reconocido:
65.

Otro:

Especialización normal:
30 potenciales.

Especialización clínica:
60 potenciales.

Bruto:
90.

Tope:
75.

Reconocido:
75.

Cuando haya que reducir:

preservar primero la estructura del combo y posteriormente aplicar relevancia por fecha.

============================================================
28. MAESTRÍA + ESPECIALIZACIÓN CLÍNICA
============================================================

CORRECCIÓN IMPORTANTE:

NO limitar esta combinación permanentemente a 60.

El máximo del conjunto puede llegar hasta:

75 puntos.

Principio:

Maestría:
hasta 40.

Especialización clínica:
15 por año completo.

Tope final del conjunto:

75.

Ejemplo:

Maestría:
40.

Clínica 1 año:
15.

Total:
55.

Resultado:
55.

Otro:

Maestría:
40.

Clínica 2 años:
30.

Bruto:
70.

Resultado:
70.

Otro:

Maestría:
40.

Clínica 5 años:
75 potenciales.

Bruto:
115.

Tope:
75.

Resultado reconocido:
75.

Una distribución válida del reconocimiento:

Maestría:
40.

Especialización clínica:
35.

Total:
75.

IMPORTANTE:

NO eliminar los 40 puntos de Maestría solo porque la clínica potencialmente pueda llegar sola a 75.

El combo debe conservar representación del aporte de ambos grupos.

============================================================
29. DOS MAESTRÍAS + ESPECIALIZACIÓN CLÍNICA
============================================================

Ejemplo:

2 Maestrías:

grupo Maestrías:
60.

Posteriormente existe una Especialización clínica.

El conjunto puede llegar como máximo:

75.

Ejemplo:

Maestrías:
60 reconocibles.

Clínica:
45 potenciales.

Bruto:
105.

Tope del nivel superior presente:
75.

Resultado:
75.

La clínica puede incrementar el reconocimiento global desde:

60
→ hasta 75.

No puede generar:

60 + 45 = 105 reconocidos.

============================================================
30. PRINCIPIO DE IMPORTANCIA ENTRE GRUPOS
============================================================

Cuando NO exista una regla específica más restrictiva en la tabla:

utilizar la jerarquía:

Especialización normal
<
Maestría
<
Especialización clínica
<
Doctorado

y aplicar como máximo global de la combinación el tope del grupo más importante presente:

Solo Especialización:
máximo 30.

Especialización + Maestría:
máximo 60.

Maestría + Clínica:
máximo 75.

Especialización + Clínica:
máximo 75.

Especialización + Maestría + Clínica:
máximo 75.

Cualquier combinación con Doctorado:
puede llegar hasta 140,

SALVO cuando exista una regla explícita más específica, como:

Maestría + un Doctorado:
máximo 120.

Las REGLAS EXPLÍCITAS tienen prioridad sobre esta regla general.

============================================================
31. PRIORIDAD DE REGLAS
============================================================

Orden obligatorio de decisión:

PRIORIDAD 1
Reglas explícitas específicas de combinación.

PRIORIDAD 2
Reglas de grupo.

PRIORIDAD 3
Jerarquía de importancia.

PRIORIDAD 4
Tope global absoluto de posgrados = 140.

Ejemplo:

Maestría + Doctorado

Aunque Doctorado tenga nivel máximo global de 140:

existe regla específica:

Maestría + Doctorado = 120.

Por tanto:

usar 120.

Ejemplo:

Especialización normal + Clínica

la regla corregida indica:

máximo 75.

Usar 75.

============================================================
32. TOPE GLOBAL ABSOLUTO
============================================================

SIN EXCEPCIONES:

puntajePosgradoReconocido <= 140

Nunca:

141
145
150
160
180
200

Incluso si la suma potencial de títulos fuera superior.

============================================================
33. REDUCCIÓN CUANDO SE SUPERA EL TOPE
============================================================

Cuando la suma potencial supera el máximo aplicable:

NO eliminar títulos.

NO cambiar puntajes potenciales.

Reducir únicamente:

puntajeReconocido.

Ejemplo:

Bruto:
160.

Tope:
140.

Reconocido:
140.

Los 20 puntos que exceden deben reducirse respetando:

1. distribución explícita del combo;
2. reglas de grupo;
3. títulos más recientes tienen mayor relevancia;
4. reducir primero títulos más antiguos cuando sea necesario;
5. ningún título reconocido puede superar su puntaje potencial.

============================================================
34. MÁS POSGRADOS CUANDO YA SE ALCANZÓ 140
============================================================

Si un conjunto ya alcanza:

140 puntos

y se agregan nuevos títulos:

NO aumentar el total.

Debe mantenerse:

140.

Los nuevos títulos pueden cambiar la distribución interna del reconocimiento si son más relevantes y si la regla correspondiente lo permite.

Pero:

puntaje total de posgrados sigue siendo 140.

Ejemplo conceptual:

Antes:
140 reconocidos.

Se agrega un título más reciente y relevante.

El sistema puede redistribuir qué títulos explican esos 140.

Pero:

TOTAL = 140.

============================================================
35. NO HACER QUE LOS TÍTULOS ANTIGUOS DESAPAREZCAN
============================================================

Cuando un título más reciente tenga mayor relevancia:

NO eliminar títulos anteriores.

NO ocultarlos.

NO convertirlos automáticamente todos en 0.

Solo reducir su puntaje reconocido si:

- existe un tope;
- existe una regla que limita cantidad;
- existe una combinación que obliga a redistribuir.

Todos siguen formando parte del expediente.

============================================================
36. MOTOR CENTRALIZADO
============================================================

Crear o corregir UNA única función central equivalente a:

calcularPuntajeFormacion(expediente)

Debe ejecutar conceptual y secuencialmente:

FASE 1
Obtener todos los títulos.

FASE 2
Separar Pregrado y Posgrado.

FASE 3
Filtrar títulos reconocibles.

FASE 4
Agrupar Posgrados en:

- Especialización normal;
- Maestría;
- Especialización clínica;
- Doctorado.

FASE 5
Calcular puntaje potencial individual.

FASE 6
Calcular subtotal potencial de cada grupo.

FASE 7
Aplicar tope interno de cada grupo.

FASE 8
Detectar reglas específicas de combinación.

FASE 9
Aplicar la combinación específica si existe.

FASE 10
Si no existe combinación específica:
utilizar jerarquía de importancia.

FASE 11
Determinar el tope global del conjunto.

FASE 12
Distribuir el puntaje reconocido entre títulos.

FASE 13
Priorizar títulos más recientes cuando haya que reducir dentro de un mismo contexto.

FASE 14
Aplicar:

Posgrados <= 140.

FASE 15
Aplicar:

Pregrado <= 183.

FASE 16
Calcular:

Total Formación =
Pregrado reconocido
+
Posgrado reconocido.

FASE 17
Generar desglose explicativo.

============================================================
37. ESTRUCTURA DEL RESULTADO DEL MOTOR
============================================================

La función debería producir conceptualmente:

{
    pregrado: {
        potencial: ...,
        reconocido: ...,
        tope: 183
    },

    gruposPosgrado: {
        especializaciones: {
            potencial: ...,
            reconocido: ...,
            tope: 30
        },

        maestrias: {
            potencial: ...,
            reconocido: ...,
            tope: 60
        },

        clinicas: {
            potencial: ...,
            reconocido: ...,
            tope: 75
        },

        doctorados: {
            potencial: ...,
            reconocido: ...,
            tope: ...
        }
    },

    reglaAplicada: "...",

    topeCombinacion: ...,

    posgradoBruto: ...,

    posgradoReconocido: ...,

    totalFormacion: ...,

    detalleTitulos: [...]
}

Adapta nombres y estructuras al código existente.

No es obligatorio copiar este objeto literalmente.

Sí es obligatorio conservar conceptualmente esta separación.

============================================================
38. CAMBIO DE FEEDBACK VISUAL
============================================================

Modificar únicamente la forma de presentar los resultados de Formación académica.

NO rediseñar toda la pantalla.

La información debe ocupar MENOS ESPACIO.

Actualmente evitar cards grandes por cada título.

Utilizar:

LISTAS COMPACTAS.

Agrupar títulos similares.

Orden recomendado:

1. Pregrado
2. Especializaciones normales
3. Maestrías
4. Especializaciones clínicas
5. Doctorados

============================================================
39. ENCABEZADO DE CADA GRUPO
============================================================

Cada grupo debe mostrar claramente su máximo.

Ejemplo:

ESPECIALIZACIONES NORMALES
Máximo acumulable: 30 puntos

MAESTRÍAS
Máximo acumulable: 60 puntos

ESPECIALIZACIONES CLÍNICAS
Máximo acumulable: 75 puntos

DOCTORADOS
Máximo acumulable: hasta 140 puntos según combinación

Dentro colocar los registros en lista compacta.

============================================================
40. FILA COMPACTA DE TÍTULO
============================================================

Cada título puede mostrarse aproximadamente como:

Nombre del título
Institución
Fecha
Puntaje potencial
Puntaje reconocido
Estado

No utilizar una card enorme para cada registro.

Mantener buena legibilidad.

============================================================
41. PUNTAJES AJUSTADOS
============================================================

Cuando:

puntajePotencial != puntajeReconocido

mostrar ambos.

Ejemplo:

Especialización clínica

Potencial:
45

Reconocido:
15

Motivo:
“Tope de combinación alcanzado.”

El puntaje potencial no reconocido debe utilizar:

color secundario / gris / neutral.

NO rojo.

Rojo solamente para:

error real.

============================================================
42. RESUMEN DEL CÁLCULO
============================================================

Agregar una sección compacta:

“Detalle del cálculo”

Puede ser desplegable.

Mostrar:

Regla aplicada

Ejemplo:

“Maestría + Especialización clínica”

Subtotales:

Especializaciones:
0 / 30

Maestrías:
40 / 60

Clínicas:
35 / 75

Doctorados:
0

Suma potencial:
115

Tope de combinación:
75

Puntaje reconocido de posgrados:
75

Pregrado:
183

Total Formación:
258

============================================================
43. RECÁLCULO AUTOMÁTICO
============================================================

Recalcular automáticamente cuando:

- se agrega título;
- se elimina;
- se edita;
- cambia fecha;
- cambia duración;
- cambia tipo;
- cambia especialización normal/clínica;
- cambia Medicina/Odontología;
- cambia Maestría;
- cambia Doctorado;
- cambia convalidación;
- cambia validación;
- un título deja de ser reconocido;
- un título pasa a ser reconocido.

NO crear botón:

“Recalcular”.

============================================================
44. PRUEBAS OBLIGATORIAS — GRUPOS
============================================================

TEST 01

Especialización normal:
3 años.

Resultado potencial:
30.

Grupo:
30 máximo.

----------------------------

TEST 02

2 Especializaciones normales:
20 + 20.

Bruto:
40.

Reconocido:
30.

----------------------------

TEST 03

1 Maestría.

Resultado:
hasta 40.

----------------------------

TEST 04

2 Maestrías.

Resultado:
40 + 20 = 60.

----------------------------

TEST 05

3 Maestrías.

Resultado:
20 + 20 + 20 = 60.

Nunca > 60.

----------------------------

TEST 06

Clínica:
5 años completos.

Resultado:
75.

----------------------------

TEST 07

Clínica:
2.5 años declarados.

Solo contar años completos.

Resultado:
2 años reconocibles.

30 puntos.

NO 37.5.

----------------------------

TEST 08

2 Clínicas:

30 + 45.

Resultado:
75.

----------------------------

TEST 09

2 Clínicas:

45 + 60.

Bruto:
105.

Reconocido:
75.

Priorizar la más reciente en la distribución.

============================================================
45. PRUEBAS OBLIGATORIAS — COMBOS
============================================================

TEST 10

Especialización normal:
30 potenciales.

Maestría:
40.

Resultado:

Especialización reconocida dentro de combo:
20.

Maestría:
40.

Total:
60.

NO 70.

----------------------------

TEST 11

Especializaciones:
30.

Maestrías:
60.

Bruto:
90.

Resultado:
60.

----------------------------

TEST 12

Especialización:
20.

Maestría:
40.

Doctorado:
80.

Resultado:
140.

----------------------------

TEST 13

Maestría:
40.

Doctorado:
80.

Resultado:
120.

----------------------------

TEST 14

Doctorado sin Maestría.

Resultado:
hasta 120.

----------------------------

TEST 15

2 Doctorados sin Maestría.

Resultado:
120 + 20.

Total:
140.

----------------------------

TEST 16

Especialización:
20.

Doctorado sin Maestría:
120.

Total:
140.

----------------------------

TEST 17

Maestría:
40.

2 Doctorados:
80 + 20.

Total:
140.

----------------------------

TEST 18

3 Doctorados.

Seleccionar únicamente 2 para reconocimiento.

Criterios:

mayor puntaje potencial;
si empatan:
más recientes.

El tercero:
visible pero 0 reconocido.

============================================================
46. PRUEBAS — CLÍNICAS EN COMBOS
============================================================

TEST 19

Especialización normal:
20.

Clínica:
45.

Resultado:
65.

----------------------------

TEST 20

Especialización normal:
30 potencial.

Clínica:
60 potencial.

Bruto:
90.

Tope:
75.

Reconocido:
75.

----------------------------

TEST 21

Maestría:
40.

Clínica:
15.

Resultado:
55.

----------------------------

TEST 22

Maestría:
40.

Clínica:
30.

Resultado:
70.

----------------------------

TEST 23

Maestría:
40.

Clínica:
75 potencial.

Bruto:
115.

Tope:
75.

Resultado:
75.

Mantener representación del aporte de Maestría.

----------------------------

TEST 24

2 Maestrías:
60.

Agregar después Clínica:
45 potenciales.

Bruto:
105.

Resultado:
75.

La clínica permite pasar:

60 → 75.

============================================================
47. PRUEBAS — CONVALIDACIÓN
============================================================

TEST 25

Maestría válida:
40.

Doctorado extranjero pendiente:
80 potenciales.

Resultado reconocido:

40.

El Doctorado NO determina todavía el combo.

----------------------------

TEST 26

Convalidar el Doctorado.

Recalcular automáticamente.

Nuevo combo:

Maestría + Doctorado.

Resultado:
hasta 120.

============================================================
48. PRUEBA — MÁXIMO GLOBAL
============================================================

TEST 27

Cualquier conjunto que genere:

160 puntos potenciales.

Resultado reconocido de Posgrados:

máximo 140.

Nunca superar 140.

============================================================
49. PRUEBA — TOTAL FORMACIÓN
============================================================

Pregrado Medicina Humana:
183.

Posgrados:
140.

Resultado:

Total Formación académica:
323.

============================================================
50. NO HACER
============================================================

NO modificar módulos ajenos.

NO reconstruir la aplicación.

NO modificar Experiencia calificada.

NO modificar Productividad académica.

NO modificar Categoría docente.

NO modificar Login.

NO modificar Dashboard.

NO modificar Exportación.

NO rehacer el wizard.

NO eliminar títulos para cumplir topes.

NO ocultar títulos excedentes.

NO hacer que títulos pendientes participen.

NO permitir que un título no convalidado cambie el combo.

NO usar una simple suma global.

NO solucionar todo exclusivamente con:

Math.min(total, 140)

porque existen reglas de grupo y combinación.

NO sumar Especialización 30 + Maestría 40 y devolver 70.

Debe ser 60.

NO limitar Maestría + Clínica a 60.

Puede llegar a 75.

NO limitar Especialización normal + Clínica a 60.

Puede llegar a 75.

NO permitir Especializaciones normales > 30.

NO permitir Maestrías > 60.

NO permitir Clínicas > 75.

NO permitir Posgrados > 140.

NO contar fracciones de año de Especialización clínica.

NO eliminar el puntaje potencial cuando se aplica un recorte.

NO usar rojo para un puntaje simplemente no reconocido por tope.

NO considerar el orden de digitación como regla normativa.

NO hacer desaparecer títulos antiguos por existir títulos recientes.

NO permitir que un mismo título sea sumado dos veces en diferentes combos.

NO hardcodear la misma regla en múltiples componentes.

============================================================
51. CRITERIO DE FINALIZACIÓN
============================================================

NO consideres completada esta tarea porque visualmente aparezcan los topes.

Debe modificarse realmente:

- modelo de cálculo;
- estado;
- agrupación;
- sumatoria;
- reconocimiento;
- combinaciones;
- recálculo;
- selección de títulos;
- topes;
- feedback.

La tarea está terminada únicamente cuando:

1. los títulos están agrupados correctamente;

2. cada grupo conoce su tope;

3. Especializaciones normales nunca superan 30;

4. Maestrías nunca superan 60;

5. Clínicas nunca superan 75;

6. Doctorados respetan sus reglas específicas;

7. Posgrados nunca superan 140;

8. Especialización + Maestría produce máximo 60;

9. Especialización + Maestría + Doctorado puede producir 140;

10. Maestría + Doctorado produce máximo 120;

11. Maestría + 2 Doctorados produce máximo 140;

12. Especialización + Clínica puede llegar a 75;

13. Maestría + Clínica puede llegar a 75;

14. varias Clínicas pueden sumar entre sí pero nunca superar 75;

15. tres Maestrías reparten máximo 60;

16. con más de dos Doctorados solo participan los dos seleccionados según puntaje/relevancia;

17. títulos más recientes tienen prioridad cuando se necesita reducir reconocimiento;

18. títulos antiguos continúan visibles;

19. títulos no convalidados no participan;

20. al convalidarse se recalcula todo;

21. puntaje potencial y reconocido están separados;

22. el usuario puede entender qué regla se aplicó;

23. el feedback de Formación está organizado en listas compactas;

24. el total de Pregrado continúa separado;

25. el máximo final sigue siendo:

Pregrado 183
+
Posgrado 140
=
323.

IMPLEMENTA AHORA ESTA CORRECCIÓN SOBRE EL CÓDIGO EXISTENTE.

NO CAMBIES NADA FUERA DEL MOTOR DE PUNTAJES Y DEL FEEDBACK VISUAL DE FORMACIÓN ACADÉMICA.