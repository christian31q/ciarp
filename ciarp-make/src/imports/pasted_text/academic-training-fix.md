PROMPT MASTER DE CORRECCIÓN CRÍTICA
FIGMA MAKE — REPARAR MOTOR DE FORMACIÓN ACADÉMICA + FEEDBACK VISUAL

PROYECTO:
“Registro, validación y valoración”
Universidad Militar Nueva Granada

IMPORTANTE:
Trabaja SOBRE EL CÓDIGO EXISTENTE.

NO reconstruyas la aplicación.
NO cambies otros módulos.
NO cambies Experiencia calificada.
NO cambies Productividad académica.
NO cambies Categoría docente.
NO cambies login, dashboard, sidebar o navegación.
NO cambies la estética global.

ESTA ITERACIÓN DEBE CORREGIR DE VERDAD EL CÓDIGO DEL MÓDULO:

“FORMACIÓN ACADÉMICA”

La implementación actual es INCORRECTA.

Actualmente existen por lo menos estos errores:

1. El feedback muestra años de duración que nunca fueron ingresados, por ejemplo “1 año” en una Especialización general.
2. La duración de una Especialización clínica no se puede aumentar correctamente.
3. El cálculo de Especializaciones clínicas debe crecer con los años pero detenerse en 75 puntos.
4. La suma de Especialización normal + Especialización clínica está siendo calculada incorrectamente.
5. El sistema está sumando puntos individuales antes de respetar el tope del grupo/combinación.
6. Un caso que debería dar 253 puntos está arrojando aproximadamente 290.
7. El feedback visual solicitado mediante LISTAS AGRUPADAS no fue implementado.
8. El sistema parece conservar lógica anterior que ya debería haber sido reemplazada.

NO hagas cambios cosméticos solamente.

DEBES CORREGIR:

- modelo de cálculo;
- funciones;
- estado;
- subtotal por grupos;
- topes;
- combinaciones;
- recálculo;
- duración clínica;
- información presentada;
- listas del feedback.

============================================================
1. PRIMERA REGLA: ELIMINAR LA SUMA INCORRECTA ACTUAL
============================================================

Busca en el código toda lógica actual relacionada con:

- totalFormacion;
- totalPosgrados;
- puntajeFormacion;
- calcularFormacion;
- calcularPosgrados;
- subtotalFormacion;
- suma de especializaciones;
- suma de maestrías;
- suma de clínicas;
- suma de doctorados.

NO permitas que existan dos motores de cálculo funcionando simultáneamente.

ELIMINA o sustituye cualquier comportamiento equivalente a:

totalPosgrados =
especializacionNormal
+ especializacionClinica
+ maestria
+ doctorado

sin aplicar primero los topes y combinaciones.

Eso está generando resultados incorrectos.

Debe existir UNA SOLA FUNCIÓN CENTRAL que determine el puntaje reconocido de Formación académica.

Ejemplo conceptual:

calcularFormacionAcademica(titulos)

Esta debe ser la única fuente de verdad utilizada por:

- formulario;
- resumen;
- feedback;
- dashboard;
- historial;
- puntaje total.

============================================================
2. SEPARAR PREGRADO Y POSGRADO
============================================================

El cálculo debe dividirse obligatoriamente:

PREGRADO

y

POSGRADOS.

El pregrado NO forma parte de los topes internos de posgrado.

Fórmula:

TOTAL FORMACIÓN =
PREGRADO RECONOCIDO
+
POSGRADO RECONOCIDO

Topes:

Pregrado:
máximo 183.

Posgrados:
máximo 140.

============================================================
3. PREGRADO — NO CAMBIAR
============================================================

Mantener:

Pregrado general:
178 puntos.

Medicina Humana:
183 puntos.

Composición Musical:
183 puntos.

Máximo reconocido de Pregrado:
183.

============================================================
4. REGLA FUNDAMENTAL DE POSGRADOS
============================================================

NO sumar simplemente todos los puntos potenciales.

Primero:

1. calcular cada título;
2. agrupar por tipo;
3. aplicar topes del grupo;
4. detectar la combinación de grupos existente;
5. aplicar el tope de esa combinación;
6. distribuir el puntaje reconocido;
7. aplicar finalmente máximo global 140.

ORDEN CONCEPTUAL:

Especialización normal
<
Maestría
<
Especialización clínica
<
Doctorado

Topes principales:

Especializaciones normales:
30.

Maestrías:
60.

Especializaciones clínicas:
75.

Doctorados / combinaciones con Doctorado:
hasta 140 según la regla aplicable.

============================================================
5. CORRECCIÓN CRÍTICA DEL CASO NORMAL + CLÍNICA
============================================================

ESTA ES UNA DE LAS REGLAS QUE ACTUALMENTE ESTÁ MAL.

Si existe:

Especialización normal
+
Especialización clínica

NO se deben sumar sus máximos de manera independiente.

NO hacer:

30 + 75 = 105.

NO hacer:

20 + 75 = 95.

La combinación completa:

Especialización normal
+
Especialización clínica

TIENE UN TOPE TOTAL DE:

75 PUNTOS.

Por tanto:

posgradoReconocido =
min(
    puntajeEspecializacionesNormales
    +
    puntajeEspecializacionesClinicas,
    75
)

Ejemplo:

Especialización normal:
20

Especialización clínica:
5 años × 15 = 75

Suma potencial:
95

TOPE DE LA COMBINACIÓN:
75

PUNTAJE RECONOCIDO DE POSGRADOS:
75

NO 95.

============================================================
6. CASO OBLIGATORIO QUE ACTUALMENTE ESTÁ FALLANDO
============================================================

PRUEBA EXACTAMENTE ESTE CASO.

Pregrado general:
178 puntos.

Especialización normal:
existente.

Especialización clínica:
5 años completos.

Especialización clínica:
5 × 15 = 75 puntos potenciales.

Aunque exista adicionalmente una Especialización normal:

EL BLOQUE DE POSGRADOS EN ESTA COMBINACIÓN NO PUEDE SUPERAR:

75.

Entonces:

Pregrado:
178

Posgrados:
75

TOTAL FORMACIÓN:

178 + 75 = 253

RESULTADO OBLIGATORIO:

253 PUNTOS.

Si la aplicación produce:

270
275
283
288
290
95 puntos de posgrado
105 puntos de posgrado

o cualquier resultado distinto de 253:

EL CÁLCULO SIGUE ESTANDO MAL.

NO des por terminada la tarea hasta que este test dé exactamente:

253.

============================================================
7. SEGUNDO TEST DE CONTROL
============================================================

Pregrado Medicina Humana:

183.

Especialización normal.

Especialización clínica:
5 años = 75 potenciales.

Tope Normal + Clínica:

75.

Resultado:

183 + 75 = 258.

TOTAL:

258.

Esto confirma que el Pregrado se suma por fuera del tope.

============================================================
8. ESPECIALIZACIÓN NORMAL
============================================================

La lógica individual de Especialización normal se conserva.

El máximo del GRUPO de Especializaciones normales es:

30 puntos.

Pero:

NO mostrar información que el usuario nunca ingresó.

ACTUALMENTE EL FEEDBACK INVENTA DURACIONES.

Ejemplo incorrecto:

“Especialización normal — 1 año”

cuando el sistema nunca recibió ese valor.

PROHIBIDO.

============================================================
9. NO INVENTAR DURACIÓN DE ESPECIALIZACIÓN NORMAL
============================================================

Si el registro de Especialización normal NO contiene una duración real:

NO mostrar:

“1 año”

NO mostrar:

“2 años”

NO asumir una duración por defecto.

NO crear:

duracion = 1

como fallback silencioso.

NO utilizar:

formacion.duracion || 1

o equivalentes.

Esto está prohibido.

Si no existe información de duración:

mostrar simplemente:

“Especialización normal”

o:

“Duración no registrada”

solo si realmente es necesario mostrar el estado.

Pero NO inventar una cifra.

============================================================
10. SI LA DURACIÓN GENERAL ES NECESARIA PARA EL CÁLCULO
============================================================

Si la implementación necesita conocer duración de una Especialización normal para diferenciar:

1–2 años
vs.
más de 2 años,

entonces el dato debe provenir de un campo REAL del formulario.

NO inferirlo.

NO inventarlo.

Si el dato existe en el modelo:
utilizarlo.

Si actualmente NO existe pero es indispensable para la regla:
añadir dentro del formulario de Especialización normal un campo explícito:

“Duración en años”

y utilizar exclusivamente el valor ingresado.

Pero:

NO asignar automáticamente 1 año.

============================================================
11. ESPECIALIZACIÓN CLÍNICA — DURACIÓN EDITABLE
============================================================

La Especialización clínica DEBE permitir que el usuario indique libremente la cantidad de años completos.

Campo:

“Duración en años *”

Debe ser numérico.

Permitir aumentar/disminuir la duración.

Ejemplos válidos:

1
2
3
4
5
6
7
8

No fijar máximo visual en 5.

IMPORTANTE:

El usuario puede registrar:

6 años
7 años
8 años

pero el PUNTAJE reconocido individual de la clínica se detiene en 75.

============================================================
12. CÁLCULO DE ESPECIALIZACIÓN CLÍNICA
============================================================

Regla:

15 puntos por cada año COMPLETO.

Fórmula:

puntajeClinicaPotencial =
Math.min(
    añosCompletos * 15,
    75
)

Ejemplos:

1 año:
15

2 años:
30

3 años:
45

4 años:
60

5 años:
75

6 años:
75

7 años:
75

8 años:
75

Nunca:

90
105
120

aunque la duración sea superior a 5 años.

============================================================
13. NO BLOQUEAR DURACIÓN A 5
============================================================

NO hacer:

maxYears = 5

NO impedir introducir 6, 7 u 8 años.

La duración REAL puede superar 5.

Lo que tiene límite es:

EL PUNTAJE.

No:

LA DURACIÓN.

Esta diferencia es crítica.

Ejemplo:

Duración declarada:
8 años

Puntaje potencial:
75

Feedback:

“8 años · 75 puntos”

NO:

“5 años”

NO modificar el dato real para hacerlo coincidir con el tope.

============================================================
14. SOLO AÑOS COMPLETOS PARA CLÍNICA
============================================================

No reconocer fracciones.

Si por alguna razón el campo admite:

5.7

usar:

Math.floor(5.7) = 5

Resultado:

75.

Preferiblemente validar el campo como número entero positivo.

No permitir:

0
negativos
texto
NaN.

============================================================
15. VARIAS ESPECIALIZACIONES CLÍNICAS
============================================================

Se pueden registrar varias.

Se suman sus puntajes potenciales.

Pero el grupo completo tiene máximo:

75.

Ejemplo:

Clínica A:
2 años = 30.

Clínica B:
3 años = 45.

Total:
75.

Otro:

Clínica A:
4 años = 60.

Clínica B:
3 años = 45.

Potencial:
105.

Grupo reconocido:
75.

============================================================
16. RELEVANCIA POR FECHA
============================================================

Cuando sea necesario reducir puntaje dentro de un grupo porque se alcanza un tope:

priorizar los títulos más recientes.

Ejemplo:

Clínica 2025:
60 potenciales.

Clínica 2020:
45 potenciales.

Tope:
75.

Distribución:

Clínica 2025:
60 reconocidos.

Clínica 2020:
15 reconocidos.

Total:
75.

Los títulos antiguos siguen visibles.

NO eliminarlos.

============================================================
17. TOPES BASE POR GRUPO
============================================================

Implementar nuevamente y centralizar:

ESPECIALIZACIONES NORMALES
Máximo del grupo:
30.

MAESTRÍAS
Máximo del grupo:
60.

ESPECIALIZACIONES CLÍNICAS
Máximo del grupo:
75.

DOCTORADOS
Máximo según combinación:
hasta 140.

POSGRADOS TOTAL
Máximo absoluto:
140.

============================================================
18. MAESTRÍAS
============================================================

Mantener:

1 Maestría:
hasta 40.

2 Maestrías:
máximo 60.

Ejemplo:
40 + 20.

3 Maestrías:
repartir los 60 entre las 3.

Ejemplo:
20 + 20 + 20.

Más de 3:
el grupo completo sigue sin superar 60.

============================================================
19. ESPECIALIZACIÓN NORMAL + MAESTRÍA
============================================================

Esta regla continúa:

Especialización normal + Maestría

máximo:

60.

Ejemplo potencial:

Especialización:
30.

Maestría:
40.

Bruto:
70.

Reconocido:
60.

No 70.

============================================================
20. ESPECIALIZACIÓN + MAESTRÍA + DOCTORADO
============================================================

Regla:

Especialización:
20.

Maestría:
40.

Doctorado:
80.

Total máximo:

140.

============================================================
21. MAESTRÍA + DOCTORADO
============================================================

Regla:

Maestría:
hasta 40.

Doctorado:
hasta 80.

Máximo conjunto:

120.

============================================================
22. DOCTORADO SIN MAESTRÍA
============================================================

Un Doctorado sin Maestría reconocida:

hasta 120.

Dos Doctorados sin Maestría:

máximo:
140.

Distribución de referencia:

120 + 20.

============================================================
23. MAESTRÍA + DOS DOCTORADOS
============================================================

Regla:

Maestría:
40.

Doctorado:
80.

Doctorado adicional:
20.

Total:

140.

============================================================
24. MÁS DE DOS DOCTORADOS
============================================================

Si existen 3 o más:

solo 2 participan en el reconocimiento principal.

Seleccionar:

1. los que produzcan mayor puntaje válido;
2. si empatan, los más recientes.

Los demás permanecen visibles con:

puntaje potencial

pero:

puntaje reconocido:
0

Motivo:

“Límite de Doctorados reconocibles alcanzado.”

============================================================
25. MAESTRÍA + ESPECIALIZACIÓN CLÍNICA
============================================================

El máximo de la combinación es:

75.

Ejemplos:

Maestría:
40

Clínica 1 año:
15

Resultado:
55.

Maestría:
40

Clínica 2 años:
30

Resultado:
70.

Maestría:
40

Clínica 5 años:
75 potenciales

Suma potencial:
115

Resultado reconocido:
75.

NO 115.

============================================================
26. ESPECIALIZACIÓN NORMAL + CLÍNICA
============================================================

Reiterar explícitamente:

TOPE TOTAL:

75.

Ejemplo:

Normal:
20

Clínica 2 años:
30

Resultado:
50.

Normal:
20

Clínica 4 años:
60

Bruto:
80.

Reconocido:
75.

Normal:
30 potenciales

Clínica 5 años:
75 potenciales

Bruto:
105.

Reconocido:
75.

============================================================
27. NORMAL + MAESTRÍA + CLÍNICA
============================================================

Si existen:

Especialización normal
+
Maestría
+
Especialización clínica

y NO hay Doctorado:

el nivel superior presente es:

Especialización clínica.

Tope final:

75.

NO sumar:

30 + 60 + 75.

Ejemplo:

Normal potencial:
30.

Maestrías:
60.

Clínicas:
75.

Suma potencial:
165.

Resultado reconocido del conjunto:
75.

============================================================
28. DOCTORADO TIENE PRIORIDAD DE TECHO
============================================================

Si existe Doctorado válido:

evaluar primero las reglas específicas de Doctorado.

Ejemplo:

Maestría + Doctorado:
120.

Especialización + Maestría + Doctorado:
140.

Maestría + 2 Doctorados:
140.

Nunca superar:

140.

============================================================
29. ALGORITMO OBLIGATORIO
============================================================

El motor debe seguir EXACTAMENTE este orden.

PASO 1

Obtener todos los títulos.

PASO 2

Separar:

Pregrado
Posgrado.

PASO 3

Filtrar únicamente títulos:

completos
validados
convalidados cuando corresponda.

PASO 4

Agrupar Posgrados:

Especializaciones normales
Maestrías
Especializaciones clínicas
Doctorados.

PASO 5

Calcular puntaje potencial de cada título.

PASO 6

Aplicar tope INTERNO de cada grupo.

PASO 7

Detectar combinación de grupos.

PASO 8

Aplicar tope DE LA COMBINACIÓN.

PASO 9

Distribuir puntaje reconocido entre títulos.

PASO 10

Aplicar máximo global:

Posgrado <= 140.

PASO 11

Calcular:

Formación =
Pregrado
+
Posgrado.

NO CAMBIAR ESTE ORDEN.

============================================================
30. ERROR QUE DEBE DESAPARECER
============================================================

La aplicación parece estar haciendo algo similar a:

PREGRADO
+
ESPECIALIZACIÓN NORMAL
+
ESPECIALIZACIÓN CLÍNICA

como suma independiente.

ESTO DEBE DESAPARECER.

Caso:

Pregrado general:
178.

Normal:
por ejemplo 30.

Clínica:
75.

NO hacer:

178 + 30 + 75 = 283.

NO hacer ninguna variante cercana a 290.

Debe hacer:

Normal + Clínica
→ tope del combo 75.

Entonces:

178 + 75 = 253.

============================================================
31. NO DOBLE CONTABILIZACIÓN
============================================================

Un título no puede contribuir:

a su grupo

Y DESPUÉS

volver a ser sumado completo dentro del combo.

Ejemplo incorrecto:

grupo clínicas:
75

+
clínica individual:
75

Esto duplicaría puntos.

PROHIBIDO.

Cada título debe participar UNA sola vez en el resultado reconocido.

============================================================
32. NO SUMAR SUBTOTAL + REGISTROS
============================================================

Busca específicamente errores como:

total =
subtotalEspecializaciones
+
subtotalClinicas
+
formaciones.reduce(...)

si `formaciones.reduce` ya contiene esos mismos títulos.

Evitar cualquier doble suma.

============================================================
33. UNA SOLA VARIABLE DE RESULTADO
============================================================

Debe existir conceptualmente:

formationScore.pregradoRecognized

formationScore.postgraduateRecognized

formationScore.totalRecognized

El resto de la UI debe LEER esos valores.

NO recalcular independientemente desde cada componente.

============================================================
34. FEEDBACK VISUAL — LA IMPLEMENTACIÓN ACTUAL NO SIRVE
============================================================

La interfaz actual NO está aplicando las instrucciones anteriores.

DEBES CAMBIAR EL FEEDBACK DE FORMACIÓN.

No modificar toda la página.

Solo reemplazar el área donde se muestran los títulos ya agregados y el resumen de puntaje.

OBJETIVO:

más compacto;
más ordenado;
agrupado;
fácil de auditar.

============================================================
35. PROHIBIDO USAR CARDS GRANDES POR TÍTULO
============================================================

NO mostrar cada formación mediante una tarjeta grande vertical.

NO hacer que 5 títulos ocupen toda la página.

Cambiar a:

LISTAS COMPACTAS AGRUPADAS.

============================================================
36. ESTRUCTURA VISUAL OBLIGATORIA
============================================================

Mostrar grupos en este orden:

PREGRADO

ESPECIALIZACIONES NORMALES

MAESTRÍAS

ESPECIALIZACIONES CLÍNICAS

DOCTORADOS

Ocultar un grupo si no contiene registros, salvo que estructuralmente sea necesario.

============================================================
37. ENCABEZADO DEL GRUPO
============================================================

Cada grupo debe tener encabezado compacto.

Ejemplo:

ESPECIALIZACIONES NORMALES
Máximo acumulable: 30 puntos

MAESTRÍAS
Máximo acumulable: 60 puntos

ESPECIALIZACIONES CLÍNICAS
Máximo acumulable: 75 puntos

DOCTORADOS
Máximo acumulable: 140 puntos según combinación

NO repetir el máximo dentro de cada fila.

============================================================
38. FILAS COMPACTAS
============================================================

Cada título debe ocupar aproximadamente una sola fila o una fila expandible compacta.

Ejemplo conceptual:

Medicina Interna | Universidad X | 5 años | Potencial 75 | Reconocido 55 | ✓ Validado

NO usar cards enormes.

Campos recomendados:

Nombre
Institución
Fecha de finalización
Duración si realmente existe
Puntaje potencial
Puntaje reconocido
Estado
Acciones

============================================================
39. NUNCA MOSTRAR DURACIÓN FALSA
============================================================

Si una Especialización normal no tiene duración registrada:

su fila NO puede mostrar:

“1 año”.

Debe verse por ejemplo:

Especialización en Docencia Universitaria
Universidad X
Potencial: 20
Reconocido: 20

SIN duración inventada.

============================================================
40. CLÍNICAS SÍ MUESTRAN DURACIÓN REAL
============================================================

Especialización clínica:

Cardiología
5 años
Potencial: 75
Reconocido: 55

Si el usuario cambia duración:

5 → 7

la lista debe mostrar:

7 años

pero:

Potencial:
75

NO cambiar la duración visual a 5.

============================================================
41. MOSTRAR POTENCIAL Y RECONOCIDO
============================================================

Cuando sean iguales:

puede mostrarse solo:

“75 pts”

o una presentación compacta equivalente.

Cuando sean diferentes:

mostrar ambos.

Ejemplo:

Potencial:
75

Reconocido:
45

Motivo:
“Tope del grupo/combinación aplicado.”

Utilizar color secundario para el potencial no reconocido.

NO rojo.

============================================================
42. RESUMEN COMPACTO
============================================================

Al final de las listas agregar:

“Resumen de Formación”

Ejemplo:

Pregrado
178 pts

Especializaciones normales
30 potenciales

Especializaciones clínicas
75 potenciales

Regla aplicada
Especialización normal + Especialización clínica

Tope de Posgrados aplicable
75 pts

Posgrados reconocidos
75 pts

TOTAL FORMACIÓN
253 pts

El total debe ser visualmente claro.

============================================================
43. MOSTRAR LA REGLA APLICADA
============================================================

Para facilitar auditoría incluir:

“Regla aplicada”

Ejemplos:

Solo Especialización normal

Especialización + Maestría

Especialización + Especialización clínica

Maestría + Especialización clínica

Especialización + Maestría + Doctorado

Maestría + Doctorado

etc.

============================================================
44. CASO VISUAL OBLIGATORIO
============================================================

Para:

Pregrado general:
178

Especialización normal

Clínica de 5 años:
75

la UI debe mostrar aproximadamente:

PREGRADO
Pregrado general
178 pts

ESPECIALIZACIONES NORMALES
Máximo acumulable: 30 pts
[registro compacto]

ESPECIALIZACIONES CLÍNICAS
Máximo acumulable: 75 pts
[registro 5 años · 75 potencial]

RESUMEN

Regla:
Especialización normal + Especialización clínica

Tope del combo:
75

Posgrados reconocidos:
75

Pregrado:
178

TOTAL:
253

============================================================
45. RECÁLCULO EN TIEMPO REAL
============================================================

Al modificar duración clínica:

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

7 años:
75.

Actualizar inmediatamente:

- fila;
- subtotal clínicas;
- combinación;
- posgrado reconocido;
- total Formación.

============================================================
46. PRUEBA AUTOMÁTICA 1 — ERROR ACTUAL
============================================================

Crear:

Pregrado general = 178.

Especialización normal.

Especialización clínica = 5 años.

ESPERADO:

Clínica potencial:
75.

Combo:
Normal + Clínica.

Tope:
75.

Posgrados reconocidos:
75.

Total:
253.

ASSERT:

totalFormacion === 253

Si no:

LA TAREA FALLA.

============================================================
47. PRUEBA AUTOMÁTICA 2
============================================================

Pregrado general:
178.

Normal:
20.

Clínica:
2 años = 30.

Posgrado bruto:
50.

Tope:
75.

Posgrado reconocido:
50.

Total:

228.

ASSERT:

178 + 50 = 228.

============================================================
48. PRUEBA AUTOMÁTICA 3
============================================================

Pregrado general:
178.

Normal potencial:
30.

Clínica:
4 años = 60.

Bruto:
90.

Combo máximo:
75.

Posgrados:
75.

Total:

253.

============================================================
49. PRUEBA AUTOMÁTICA 4
============================================================

Pregrado Medicina Humana:
183.

Normal:
30.

Clínica 5 años:
75.

Bruto posgrado:
105.

Reconocido:
75.

TOTAL:

258.

============================================================
50. PRUEBA AUTOMÁTICA 5 — DURACIÓN CLÍNICA
============================================================

Clínica:
1 año → 15.

2 años → 30.

3 años → 45.

4 años → 60.

5 años → 75.

6 años → 75.

7 años → 75.

10 años → 75.

La duración visual debe seguir mostrando el número real ingresado.

============================================================
51. PRUEBA AUTOMÁTICA 6 — VARIAS CLÍNICAS
============================================================

Clínica A:
3 años = 45.

Clínica B:
4 años = 60.

Bruto:
105.

Grupo reconocido:
75.

Nunca:
105.

============================================================
52. PRUEBA AUTOMÁTICA 7 — MAESTRÍA + CLÍNICA
============================================================

Maestría:
40.

Clínica:
5 años = 75.

Bruto:
115.

Tope:
75.

Reconocido:
75.

============================================================
53. PRUEBA AUTOMÁTICA 8 — NORMAL + MAESTRÍA
============================================================

Normal potencial:
30.

Maestría:
40.

Bruto:
70.

Tope:
60.

Reconocido:
60.

============================================================
54. PRUEBA AUTOMÁTICA 9 — MAESTRÍA + DOCTORADO
============================================================

Maestría:
40.

Doctorado:
80.

Resultado:

120.

============================================================
55. PRUEBA AUTOMÁTICA 10 — GLOBAL
============================================================

Cualquier conjunto de Posgrados:

puntajeReconocido <= 140.

Siempre.

============================================================
56. REVISAR TODAS LAS FUENTES DE TOTAL
============================================================

Antes de terminar:

busca en TODO el módulo referencias a:

score
points
puntaje
total
subtotal
formationScore
academicScore
educationPoints
postgraduatePoints

Asegúrate de que ningún componente conserve una suma antigua.

Especialmente revisar:

- pantalla del Paso 2;
- resumen del wizard;
- tabla/lista de títulos;
- estado global;
- resumen final;
- historial;
- dashboard si muestra puntaje;
- PDF si consume total.

Todo debe utilizar el NUEVO valor central.

============================================================
57. NO HACER
============================================================

NO limitar la duración clínica a 5 años.

NO permitir que el puntaje clínico supere 75.

NO inventar un año para Especialización normal.

NO utilizar fallback “1”.

NO mostrar duración si no fue registrada.

NO sumar 30 + 75 y reconocer 105 para Normal + Clínica.

NO sumar Especialización normal fuera del tope de 75 cuando existe clínica.

NO sumar los mismos títulos dos veces.

NO utilizar los subtotales y después volver a sumar los registros.

NO dejar funcionando el motor anterior.

NO presentar 290 en el caso que debe producir 253.

NO usar cards grandes para cada título.

NO ignorar las agrupaciones.

NO mezclar Especializaciones normales con Clínicas en una misma lista.

NO esconder el tope máximo de cada grupo.

NO hacer cambios en otros módulos.

============================================================
58. CRITERIO DE ACEPTACIÓN ESTRICTO
============================================================

NO finalices esta tarea hasta verificar visual y lógicamente que:

A.

Pregrado general
+
Especialización normal
+
Especialización clínica 5 años

=
253 puntos.

B.

La duración clínica puede ser:

1,2,3,4,5,6,7...

pero su puntaje jamás supera 75.

C.

Una Especialización normal nunca muestra una duración inventada.

D.

Normal + Clínica tiene máximo conjunto 75.

E.

Maestría + Clínica tiene máximo conjunto 75.

F.

Especializaciones normales como grupo:
máximo 30.

G.

Maestrías:
máximo 60.

H.

Clínicas:
máximo 75.

I.

Posgrados:
máximo 140.

J.

La interfaz de feedback está organizada mediante:

LISTAS COMPACTAS

y grupos separados:

Pregrado
Especializaciones normales
Maestrías
Especializaciones clínicas
Doctorados.

K.

Cada encabezado muestra su máximo.

L.

Se distingue:

Puntaje potencial
vs.
Puntaje reconocido.

M.

Se muestra:

Regla aplicada
y
Tope aplicado.

N.

NO quedan cards grandes individuales ocupando excesivo espacio.

O.

Existe UNA SOLA fuente central del cálculo.

P.

No queda ninguna suma antigua duplicando los puntos.

============================================================
59. INSTRUCCIÓN FINAL
============================================================

IMPLEMENTA LOS CAMBIOS REALMENTE EN EL CÓDIGO.

NO TE LIMITES A EXPLICAR QUÉ HARÍAS.

NO TE LIMITES A MODIFICAR TEXTOS.

NO TE LIMITES A AÑADIR UN Math.min() AL TOTAL FINAL.

CORRIGE:

1. LA FUENTE DE DATOS.
2. EL MOTOR DE CÁLCULO.
3. LOS TOPES.
4. LA COMBINACIÓN NORMAL + CLÍNICA.
5. LA DURACIÓN CLÍNICA.
6. LA DOBLE CONTABILIZACIÓN.
7. EL TOTAL DE FORMACIÓN.
8. EL FEEDBACK VISUAL.
9. LAS LISTAS AGRUPADAS.
10. TODOS LOS COMPONENTES QUE CONSUMEN EL TOTAL.

CASO DE CONTROL DEFINITIVO:

PREGRADO GENERAL = 178
+
ESPECIALIZACIÓN NORMAL
+
ESPECIALIZACIÓN CLÍNICA DE 5 AÑOS

POSGRADOS RECONOCIDOS = 75

TOTAL FORMACIÓN = 253

SI EL RESULTADO NO ES 253, SIGUE DEPURANDO EL MOTOR HASTA CORREGIRLO.