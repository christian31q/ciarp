PROMPT MASTER DE CORRECCIÓN — LÓGICA DE FORMACIÓN ACADÉMICA
FIGMA MAKE — MODIFICAR EL CÓDIGO EXISTENTE

Trabaja SOBRE EL PROYECTO Y EL CÓDIGO YA EXISTENTES.

NO reconstruyas la aplicación.
NO rediseñes la interfaz.
NO cambies colores, tipografía, sidebar, navegación, layout, cards, botones, espaciados ni estructura general.
NO elimines funcionalidades existentes.
NO modifiques otros módulos.

TU OBJETIVO EN ESTA ITERACIÓN ES CORREGIR DE FORMA REAL Y FUNCIONAL LA LÓGICA DEL APARTADO:

“Formación académica”

La implementación anterior NO aplicó correctamente la diferenciación de especializaciones.

Debes corregir el código, el estado del formulario, los campos condicionales y el cálculo de puntos para que la lógica funcione realmente.

==================================================
1. REGLA GENERAL OBLIGATORIA
==================================================

El sistema debe implementar EXACTAMENTE esta lógica de formación académica:

PREGRADO

1. Pregrado general
→ 178 puntos.

2. Medicina Humana
→ 183 puntos.

3. Composición Musical
→ 183 puntos.


ESPECIALIZACIÓN

4. Especialización general de 1 a 2 años
→ hasta 20 puntos.

5. Especialización general de más de 2 años
→ +10 puntos por cada año adicional.
→ máximo absoluto 30 puntos.


ESPECIALIZACIÓN CLÍNICA

6. Especialización clínica en Medicina Humana
→ 15 puntos por año.
→ máximo 75 puntos.

7. Especialización clínica en Odontología
→ 15 puntos por año.
→ máximo 75 puntos.


MAESTRÍA / MAGÍSTER

8. Maestría general
→ hasta 40 puntos.


DOCTORADO / PH.D.

9. Doctorado teniendo Maestría reconocida
→ hasta 80 puntos.

10. Doctorado sin Maestría reconocida
→ hasta 120 puntos.

==================================================
2. CORRECCIÓN PRIORITARIA — ESPECIALIZACIÓN
==================================================

ESTA ES LA CORRECCIÓN MÁS IMPORTANTE.

Actualmente el sistema trata “Especialización” de manera demasiado genérica.

Debes modificarlo.

Cuando el usuario seleccione:

Nivel de formación:
“Especialización”

debe aparecer INMEDIATAMENTE un nuevo campo obligatorio:

“¿Es una especialización clínica? *”

Opciones:

- Sí
- No

Este campo debe funcionar de manera similar a como actualmente el sistema diferencia los tipos especiales de Pregrado.

NO ocultes esta pregunta.
NO determines automáticamente si es clínica.
NO asumas que toda especialización es general.
NO asumas que toda especialización relacionada con salud es clínica.

El usuario debe seleccionar explícitamente:

Sí
o
No.

==================================================
3. SI “ES ESPECIALIZACIÓN CLÍNICA” = NO
==================================================

Si:

Nivel de formación = Especialización

y:

¿Es una especialización clínica? = No

entonces el registro debe considerarse:

“Especialización general”

NO mostrar opciones de Medicina Humana u Odontología.

Debe mostrarse o conservarse el campo necesario para conocer la duración de la especialización.

Por ejemplo:

“Duración en años *”

La duración debe participar directamente en el cálculo.

Aplicar la siguiente lógica:

Si duración >= 1 año
y duración <= 2 años:

Puntaje máximo normativo:
20 puntos.

Si duración > 2 años:

partir de:
20 puntos

y añadir:
10 puntos por cada año adicional después del segundo año.

Pero nunca superar:

30 puntos.

Lógica equivalente:

si duracionAnios <= 2:
    puntajeMaximo = 20

si duracionAnios > 2:
    puntajeMaximo = min(
        20 + ((duracionAnios - 2) * 10),
        30
    )

Ejemplos:

1 año
→ máximo 20 puntos.

2 años
→ máximo 20 puntos.

3 años
→ máximo 30 puntos.

4 años
→ máximo 30 puntos.

5 años
→ máximo 30 puntos.

Nunca permitir más de 30 puntos por esta regla.

==================================================
4. IMPORTANTE SOBRE “HASTA”
==================================================

Para Especialización general, Maestría y Doctorado la norma utiliza “hasta”.

Por tanto, diferenciar conceptualmente:

- Puntaje máximo normativo.
- Puntaje reconocido.

Si la aplicación ya maneja un valor de puntaje reconocido, conservar esa lógica.

Aplicar siempre:

puntajeReconocido <= puntajeMaximoNormativo

Nunca permitir un puntaje reconocido por encima del tope.

Si en esta versión del prototipo todavía no existe una etapa institucional para escoger un valor inferior, mostrar al menos claramente:

“Puntaje máximo aplicable”

con el valor calculado.

NO convertir silenciosamente el concepto “hasta” en una regla legal que siempre adjudique el máximo.

==================================================
5. SI “ES ESPECIALIZACIÓN CLÍNICA” = SÍ
==================================================

Si:

Nivel de formación = Especialización

y:

¿Es una especialización clínica? = Sí

entonces debe aparecer dinámicamente un SEGUNDO campo obligatorio:

“Área de la especialización clínica *”

Opciones EXACTAS:

- Medicina Humana
- Odontología

No agregar otras opciones en esta iteración.

La lógica debe quedar:

Especialización
→ ¿Es clínica?
    → Sí
        → Área clínica:
            - Medicina Humana
            - Odontología

==================================================
6. PUNTAJE DE ESPECIALIZACIÓN CLÍNICA
==================================================

Cuando:

Especialización clínica = Sí

y Área = Medicina Humana

o:

Especialización clínica = Sí

y Área = Odontología

NO aplicar la regla de especialización general.

Aplicar exclusivamente:

15 puntos por cada año.

Máximo absoluto:

75 puntos.

Fórmula:

puntajeClinico =
duracionAnios * 15

puntajeFinal =
min(puntajeClinico, 75)

Ejemplos obligatorios:

1 año
→ 15 puntos.

2 años
→ 30 puntos.

3 años
→ 45 puntos.

4 años
→ 60 puntos.

5 años
→ 75 puntos.

6 años
→ 75 puntos.

7 años
→ 75 puntos.

Nunca superar 75.

==================================================
7. MUY IMPORTANTE — NO MEZCLAR REGLAS
==================================================

Una especialización NO puede usar al mismo tiempo:

regla general
+
regla clínica.

Si:

esEspecializacionClinica = false

usar:
regla general.

Si:

esEspecializacionClinica = true

usar:
regla clínica.

Nunca sumar ambas.

Ejemplo incorrecto:

Especialización clínica de Medicina Humana de 3 años:

20 puntos generales
+
15 puntos adicionales

= 35

ESTO ESTÁ MAL.

Resultado correcto:

3 años × 15
=
45 puntos.

==================================================
8. ESTRUCTURA DE ESTADO RECOMENDADA
==================================================

Ajusta el modelo de datos del registro de Formación académica para conservar como mínimo:

nivelFormacion

tipoPregrado

esEspecializacionClinica

areaEspecializacionClinica

duracionAnios

tieneMaestriaReconocida

puntajeMaximoNormativo

puntajeReconocido

lugarObtencion

pais

convalidadoEnColombia

Mantén además los campos que ya existan y sean necesarios.

Ejemplo conceptual:

{
    nivelFormacion: "especializacion",
    esEspecializacionClinica: true,
    areaEspecializacionClinica: "medicina_humana",
    duracionAnios: 3,
    puntajeMaximoNormativo: 45
}

==================================================
9. LIMPIAR ESTADOS CONDICIONALES
==================================================

Evita que queden valores incompatibles guardados cuando el usuario cambia opciones.

EJEMPLO 1

Usuario selecciona:

Especialización
→ Clínica = Sí
→ Medicina Humana

Después cambia:

Clínica = No

Debes limpiar:

areaEspecializacionClinica = null

y recalcular usando la regla general.

EJEMPLO 2

Usuario selecciona:

Especialización clínica
→ Odontología
→ 3 años

Resultado:
45 puntos.

Luego cambia:

Clínica = No

Resultado:
usar ahora regla general.

Para 3 años:
máximo 30 puntos.

NO conservar los 45 puntos anteriores.

==================================================
10. PREGRADO — CONSERVAR Y ASEGURAR LA LÓGICA
==================================================

Cuando:

Nivel de formación = Pregrado

debe existir:

“Tipo de pregrado *”

Opciones EXACTAS:

- Pregrado general
- Medicina Humana
- Composición Musical

Aplicar:

Pregrado general
→ 178 puntos.

Medicina Humana
→ 183 puntos.

Composición Musical
→ 183 puntos.

La selección debe modificar inmediatamente el puntaje.

Ejemplo:

Pregrado general
178

cambiar a:

Medicina Humana

resultado:
183.

NO requerir eliminar y crear nuevamente el título.

==================================================
11. MAESTRÍA
==================================================

Cuando:

Nivel de formación = Maestría / Magíster

mostrar la lógica correspondiente sin preguntas de especialización clínica.

Puntaje máximo normativo:

40 puntos.

NO mostrar:

“¿Es una especialización clínica?”

NO mostrar:

“Área clínica”

porque esas preguntas solo pertenecen a Especialización.

==================================================
12. DOCTORADO
==================================================

Cuando:

Nivel de formación = Doctorado / Ph.D.

mostrar la pregunta obligatoria:

“¿Tiene Maestría reconocida? *”

Opciones:

- Sí
- No

Si:

Sí

puntaje máximo:
80 puntos.

Si:

No

puntaje máximo:
120 puntos.

Actualizar el puntaje automáticamente al cambiar la respuesta.

==================================================
13. CONDICIONALES EXACTOS DEL FORMULARIO
==================================================

El comportamiento visual y lógico debe ser exactamente:

SI nivel = Pregrado:

mostrar:
Tipo de pregrado.

ocultar:
¿Es especialización clínica?
Área clínica
¿Tiene Maestría reconocida?


SI nivel = Especialización:

mostrar:
¿Es una especialización clínica?
Duración.

Si clínica = Sí:
mostrar también:
Área de la especialización clínica.

Si clínica = No:
ocultar:
Área clínica.


SI nivel = Maestría:

ocultar:
Tipo de pregrado.
¿Es especialización clínica?
Área clínica.
¿Tiene Maestría reconocida?


SI nivel = Doctorado:

mostrar:
¿Tiene Maestría reconocida?

ocultar:
Tipo de pregrado.
¿Es especialización clínica?
Área clínica.

==================================================
14. LÓGICA CENTRAL DE CÁLCULO
==================================================

Crea o corrige UNA función centralizada de cálculo.

No distribuyas los puntajes en múltiples componentes visuales.

La lógica conceptual debe ser similar a:

function calcularFormacion(formacion) {

    if (formacion.nivel === "pregrado") {

        if (
            formacion.tipoPregrado === "medicina_humana" ||
            formacion.tipoPregrado === "composicion_musical"
        ) {
            return 183
        }

        return 178
    }


    if (formacion.nivel === "especializacion") {

        if (formacion.esEspecializacionClinica === true) {

            const puntos =
                formacion.duracionAnios * 15

            return Math.min(puntos, 75)
        }

        const duracion =
            formacion.duracionAnios

        if (duracion <= 2) {
            return 20
        }

        return Math.min(
            20 + ((duracion - 2) * 10),
            30
        )
    }


    if (formacion.nivel === "maestria") {

        return MAXIMO_40
    }


    if (formacion.nivel === "doctorado") {

        if (
            formacion.tieneMaestriaReconocida
            === true
        ) {
            return MAXIMO_80
        }

        return MAXIMO_120
    }
}

Ajusta esta función a la arquitectura real del proyecto.

NO copies literalmente este pseudocódigo si el proyecto utiliza otra estructura.

Lo importante es implementar exactamente el comportamiento.

==================================================
15. CONVALIDACIÓN INTERNACIONAL
==================================================

Mantén funcionando la lógica ya existente de:

Lugar de obtención:
- Colombia
- Exterior

Si:
Exterior

mostrar:
País
¿Está convalidado en Colombia?

Si un título internacional NO está convalidado:

mantener el registro.

Mostrar:

“Pendiente de convalidación”

NO incorporarlo al puntaje reconocido.

Esto también aplica a una especialización clínica.

Ejemplo:

Especialización clínica
Medicina Humana
3 años
Exterior
España
No convalidada

Puntaje normativo potencial:
45 puntos.

Puntaje reconocido actual:
0 / Pendiente de convalidación.

Si posteriormente:

Convalidado = Sí

recalcular:

45 puntos.

==================================================
16. REFLEJAR EL RESULTADO EN PANTALLA
==================================================

No basta con guardar esta información internamente.

El resultado debe REFLEJARSE VISUALMENTE.

En cada registro de formación mostrar de forma clara:

Tipo de formación

Subtipo, cuando corresponda

Duración

Puntaje correspondiente

Ejemplos:

“Pregrado — Medicina Humana”
“183 puntos”

“Especialización general — 2 años”
“Hasta 20 puntos”

“Especialización general — 3 años”
“Hasta 30 puntos”

“Especialización clínica — Medicina Humana — 3 años”
“45 puntos”

“Especialización clínica — Odontología — 5 años”
“75 puntos”

“Maestría / Magíster”
“Hasta 40 puntos”

“Doctorado / Ph.D. — Con Maestría reconocida”
“Hasta 80 puntos”

“Doctorado / Ph.D. — Sin Maestría reconocida”
“Hasta 120 puntos”

==================================================
17. ACTUALIZACIÓN DEL TOTAL
==================================================

Cada cambio debe propagarse inmediatamente hacia:

puntaje del título
→ subtotal de Formación académica
→ puntaje total de la valoración
→ Resumen
→ historial cuando muestre puntaje
→ datos utilizados en exportación

NO dejar valores antiguos almacenados.

NO requerir refrescar.

NO requerir botón adicional de recalcular.

==================================================
18. VALIDACIONES
==================================================

No permitir guardar una Especialización si falta responder:

“¿Es una especialización clínica?”

Si:

Clínica = Sí

no permitir guardar si falta:

“Área de la especialización clínica”

No permitir calcular una especialización si falta duración.

No permitir duración:

0

negativa

vacía

texto inválido.

Mostrar errores inline.

Ejemplos:

“Indica si corresponde a una especialización clínica.”

“Selecciona el área de la especialización clínica.”

“Indica la duración de la especialización.”

==================================================
19. NO HACER
==================================================

NO rediseñar Formación académica.

NO cambiar el estilo visual existente.

NO reconstruir el wizard.

NO crear una página independiente para especializaciones clínicas.

NO esconder la pregunta:
“¿Es una especialización clínica?”

NO tratar todas las especializaciones como generales.

NO tratar todas las especializaciones como clínicas.

NO inferir automáticamente Medicina Humana solo por el nombre del programa.

NO aplicar 178 puntos a Medicina Humana.

NO aplicar 178 puntos a Composición Musical.

NO aplicar la regla de 20–30 puntos a Medicina Humana clínica.

NO aplicar la regla de 20–30 puntos a Odontología clínica.

NO sumar regla general + regla clínica.

NO permitir especialización general > 30 puntos.

NO permitir especialización clínica > 75 puntos.

NO olvidar que Medicina Humana clínica y Odontología clínica utilizan:

15 puntos por año.

NO mostrar pregunta de especialización clínica en Pregrado.

NO mostrarla en Maestría.

NO mostrarla en Doctorado.

NO dejar valores clínicos almacenados después de cambiar a Especialización general.

NO dejar puntajes anteriores después de cambiar de subtipo.

NO romper la lógica existente de convalidación.

==================================================
20. TESTS OBLIGATORIOS
==================================================

EJECUTA Y VERIFICA ESTOS CASOS ANTES DE TERMINAR.

TEST 01

Nivel:
Pregrado

Tipo:
Pregrado general

Resultado:
178 puntos.

-------------------------

TEST 02

Nivel:
Pregrado

Tipo:
Medicina Humana

Resultado:
183 puntos.

-------------------------

TEST 03

Nivel:
Pregrado

Tipo:
Composición Musical

Resultado:
183 puntos.

-------------------------

TEST 04

Nivel:
Especialización

Debe aparecer obligatoriamente:

“¿Es una especialización clínica?”

-------------------------

TEST 05

Especialización:
Clínica = No

Duración:
2 años

Resultado:

Especialización general

Máximo:
20 puntos.

-------------------------

TEST 06

Especialización:
Clínica = No

Duración:
3 años

Resultado:

Especialización general

Máximo:
30 puntos.

-------------------------

TEST 07

Especialización:
Clínica = No

Duración:
5 años

Resultado:

máximo 30.

Nunca 50.

-------------------------

TEST 08

Especialización:
Clínica = Sí

Debe aparecer:

“Área de la especialización clínica”

-------------------------

TEST 09

Clínica:
Sí

Área:
Medicina Humana

Duración:
1 año

Resultado:
15 puntos.

-------------------------

TEST 10

Clínica:
Sí

Área:
Medicina Humana

Duración:
3 años

Resultado:
45 puntos.

-------------------------

TEST 11

Clínica:
Sí

Área:
Odontología

Duración:
4 años

Resultado:
60 puntos.

-------------------------

TEST 12

Clínica:
Sí

Área:
Odontología

Duración:
5 años

Resultado:
75 puntos.

-------------------------

TEST 13

Clínica:
Sí

Área:
Odontología

Duración:
7 años

Resultado:
75 puntos.

Nunca superar 75.

-------------------------

TEST 14

Crear:

Especialización clínica
Medicina Humana
3 años

Resultado:
45.

Cambiar después:

¿Es clínica?
No

Resultado:

debe desaparecer:
Área clínica.

Debe recalcular como especialización general.

Resultado:
máximo 30.

NO conservar 45.

-------------------------

TEST 15

Crear:

Especialización general
2 años

Resultado:
20 máximo.

Cambiar:

Clínica = Sí
Área = Medicina Humana

Resultado:
30 puntos.

NO conservar 20.

-------------------------

TEST 16

Maestría

Resultado:
máximo 40.

No debe aparecer:
¿Es especialización clínica?

-------------------------

TEST 17

Doctorado

Maestría reconocida:
Sí

Resultado:
máximo 80.

-------------------------

TEST 18

Doctorado

Maestría reconocida:
No

Resultado:
máximo 120.

==================================================
21. CRITERIO DE FINALIZACIÓN
==================================================

NO des por terminada esta corrección simplemente porque añadiste un dropdown o un checkbox.

La corrección está terminada ÚNICAMENTE SI:

1. al seleccionar Especialización aparece:
   “¿Es una especialización clínica?”

2. si responde No:
   se utiliza la lógica general de 20–30 puntos.

3. si responde Sí:
   aparece Medicina Humana / Odontología.

4. Medicina Humana clínica calcula:
   15 puntos por año, máximo 75.

5. Odontología clínica calcula:
   15 puntos por año, máximo 75.

6. el puntaje aparece correctamente en la interfaz.

7. el subtotal de Formación académica cambia.

8. el total general cambia.

9. cambiar de clínica a general limpia los datos incompatibles.

10. cambiar de general a clínica recalcula correctamente.

11. los datos persisten al Guardar borrador y volver al formulario.

12. la lógica internacional/convalidación continúa funcionando.

IMPLEMENTA AHORA ESTA CORRECCIÓN SOBRE EL CÓDIGO EXISTENTE.

NO TE LIMITES A CAMBIAR LOS TEXTOS DE LA INTERFAZ.

MODIFICA REALMENTE:
- estado;
- condicionales;
- validaciones;
- cálculo;
- persistencia;
- recálculo;
- representación del puntaje.

NO REALICES CAMBIOS FUERA DE FORMACIÓN ACADÉMICA.