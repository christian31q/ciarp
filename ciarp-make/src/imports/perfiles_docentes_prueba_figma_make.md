# Datos de prueba — Perfiles docentes para validar valoración y topes de puntaje

## Objetivo

Este archivo contiene **8 perfiles docentes ficticios, completos y realistas** para cargar en Figma Make y probar el comportamiento del sistema de valoración.

Los perfiles están distribuidos entre:

- **4 docentes en proceso**
- **4 docentes finalizados**

Los perfiles cubren diferentes áreas académicas y combinan experiencia docente, investigación, experiencia profesional, formación académica y producción académica.

### Importante sobre la prueba normativa

Los datos están diseñados para **probar la lógica del prototipo**, especialmente:

- suma de puntos desde la digitación;
- actualización inmediata de subtotales y total;
- comportamiento de topes;
- experiencia parcial y de tiempo completo;
- formación académica;
- producción académica;
- artículos;
- libros derivados de investigación;
- concepto de pares;
- puntaje digitado recibido de pares;
- títulos internacionales no convalidados;
- especialización clínica;
- cálculo automático de categoría;
- separación entre docentes en proceso y completados;
- generación del expediente PDF.

La referencia normativa principal es el **Decreto 1279 de 2002**, que regula el régimen salarial y prestacional de docentes de las universidades estatales. El Decreto establece, entre otros aspectos, factores de títulos, categoría, experiencia calificada y productividad académica, así como topes de productividad por categoría. Ver fuente oficial: https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=5356

**No utilizar estos perfiles como liquidaciones salariales reales.** Son datos de QA para validar el comportamiento del prototipo. La categoría docente, los reconocimientos concretos y la asignación final dependen también de las reglas y estatutos aplicables a la universidad.

---

# Reglas generales que Figma Make debe respetar

## Estados

Los perfiles marcados como **EN PROCESO** deben aparecer únicamente en:

**Inicio**

Los perfiles marcados como **FINALIZADO** deben aparecer únicamente en:

**Exportar Expedientes**

Cuando un perfil pase de proceso a finalizado:

1. Debe desaparecer de Inicio.
2. Debe aparecer en Exportar Expedientes.
3. Debe quedar habilitado el botón **Descargar Expediente**.
4. El PDF debe contener la información final de la valoración.
5. El PDF no debe contener salario.
6. El PDF no debe contener tiempos del proceso.

---

# Reglas de cálculo a probar

## Experiencia

Para pruebas de ingreso/reingreso, el Decreto 1279 contempla, entre otros factores, hasta:

- **6 puntos por año** de experiencia en investigación.
- **4 puntos por año** de experiencia docente universitaria.
- **4 puntos por año** de experiencia profesional calificada en dirección académica.
- **3 puntos por año** de experiencia profesional calificada diferente a la docente.

Las fracciones de año deben calcularse proporcionalmente.

El prototipo debe evitar contar simultáneamente el mismo período como experiencia completa en varias categorías. Si existen períodos simultáneos, debe aplicarse la proporcionalidad correspondiente.

## Formación

Como referencia para el régimen inicial del Decreto 1279:

- Pregrado: **178 puntos**.
- Medicina humana/composición musical: **183 puntos**.
- Especialización: hasta **20 puntos**, según duración.
- Maestría: hasta **40 puntos**.
- Doctorado: hasta **80 puntos**.
- Las especializaciones clínicas de Medicina Humana y Odontología se asimilan a Maestrías para estos efectos, con reglas particulares de acumulación.

La aplicación concreta de títulos debe respetar relación con la actividad académica y las demás condiciones normativas.

## Categoría

La categoría docente **NO es digitada**.

Debe calcularse al final, después de disponer de experiencia y títulos, de acuerdo con las reglas implementadas por el prototipo.

Como referencia del Decreto 1279 para categoría académica:

- Profesor Auxiliar / Instructor Asistente: 37 puntos.
- Profesor Asistente: 58 puntos.
- Profesor Asociado: 74 puntos.
- Profesor Titular: 96 puntos.

Estos valores de categoría son puntos asociados a la categoría y **no deben acumularse como si fueran una suma de todas las categorías anteriores**.

## Productividad académica

El Decreto establece topes máximos de reconocimiento de puntos salariales por productividad académica según categoría:

| Categoría | Tope de productividad |
|---|---:|
| Profesor Auxiliar | 80 |
| Profesor Asistente | 160 |
| Profesor Asociado | 320 |
| Profesor Titular | 540 |

El sistema debe probar que el total de productividad no supere el tope correspondiente.

### Artículos

Para artículos completos/autónomos, el Decreto contempla, entre otros:

- A1: **15 puntos por artículo**.
- A2: **12 puntos por artículo**.

Para esta prueba se utilizan principalmente A1 y A2 porque permiten comprobar fácilmente acumulación y topes.

---

# Perfil 01 — Ingeniería de Software

## Estado

**EN PROCESO**

## Datos personales

- Nombre: **Laura Marcela Rincón Torres**
- Identificación: `TEST-1001`
- Área: Ingeniería de Software
- Sede: **Sede Calle 100**
- Tipo de vinculación: **Docente de planta**
- Dedicación: **Tiempo completo**
- Fecha de creación del reporte: `03/09/2026`

## Formación académica

### Pregrado
- Ingeniería de Sistemas
- Universidad ficticia: Universidad Metropolitana de Tecnología
- Año: `2009`
- Relacionado con actividad académica: Sí
- Puntos de referencia: **178**

### Maestría
- Maestría en Ingeniería de Software
- Año: `2013`
- Relacionada con actividad académica: Sí
- Puntos de referencia: **40**

### Doctorado
- No tiene

## Experiencia

### Docencia universitaria
- `01/02/2014` – `31/01/2020`
- 6 años
- Equivalente: tiempo completo
- Puntos esperados de prueba: `6 × 4 = 24`

### Investigación
- `01/02/2020` – `31/01/2023`
- 3 años
- Equivalente: tiempo completo
- Puntos esperados: `3 × 6 = 18`

### Experiencia profesional
- `01/02/2023` – `31/01/2025`
- 2 años
- Desarrollo de software empresarial
- Puntos esperados: `2 × 3 = 6`

## Producción académica

### Artículo 1
- Tipo: **Artículo completo**
- Clasificación: A1
- Fecha de publicación: `15/05/2021`
- ISSN: `2711-1001`
- Autores: 2
- Puntos: `15`

### Artículo 2
- Tipo: **Artículo completo**
- Clasificación: A2
- Fecha de publicación: `20/10/2022`
- ISSN: `2711-1002`
- Autores: 3
- Puntos: `12`

### Artículo 3
- Tipo: **Artículo completo**
- Clasificación: A1
- Fecha de publicación: `12/03/2024`
- ISSN: `2711-1003`
- Autores: 2
- Puntos: `15`

## Prueba que debe realizar

Este perfil prueba:

- suma de experiencia;
- suma de títulos;
- varios artículos;
- ISSN visible y almacenable;
- fecha de publicación obligatoria;
- tipo de artículo limitado a Artículo completo;
- actualización del total desde la digitación;
- perfil en proceso.

---

# Perfil 02 — Medicina

## Estado

**EN PROCESO**

## Datos personales

- Nombre: **Andrés Felipe Cárdenas Mejía**
- Identificación: `TEST-1002`
- Área: Medicina Humana
- Sede: **Sede Cajicá**
- Tipo de vinculación: **Docente de planta**
- Dedicación: **Tiempo completo**
- Fecha de creación del reporte: `03/09/2026`

## Formación

### Pregrado
- Medicina
- Año: `2006`
- Puntos de referencia: **183**

### Especialización clínica
- Especialización en Medicina Interna
- Clínica: **Sí**
- Duración: **3 años**
- Año: `2010`
- Puntos de referencia: hasta el tratamiento equivalente establecido por la norma para especializaciones clínicas.

### Maestría
- No tiene

## Experiencia

### Docencia universitaria
- 2011–2018
- 8 años
- Tiempo completo
- Puntos de prueba: `8 × 4 = 32`

### Investigación
- 2019–2021
- 3 años
- Tiempo completo
- Puntos de prueba: `3 × 6 = 18`

### Práctica profesional médica
- 2022–2024
- 3 años
- Experiencia profesional calificada
- Puntos de prueba: `3 × 3 = 9`

## Producción

### Artículo 1
- Tipo: Artículo completo
- Clasificación: A1
- Fecha: `14/06/2019`
- ISSN: `2722-2001`
- Puntos: `15`

### Artículo 2
- Tipo: Artículo completo
- Clasificación: A2
- Fecha: `22/09/2020`
- ISSN: `2722-2002`
- Puntos: `12`

### Título internacional no convalidado
- Especialización internacional no convalidada
- Estado: **No convalidado**
- Puntos: **0**
- No solicitar confirmación adicional.
- No solicitar soporte adicional.

## Prueba que debe realizar

Este perfil debe comprobar:

- especialización clínica;
- campo Duración (años) obligatorio;
- duración máxima de 5;
- experiencia;
- título internacional no convalidado = 0;
- ausencia de confirmaciones innecesarias;
- cálculo de puntos durante la digitación.

---

# Perfil 03 — Ciencias Sociales

## Estado

**EN PROCESO**

## Datos personales

- Nombre: **Natalia Andrea Salazar Gómez**
- Identificación: `TEST-1003`
- Área: Ciencias Sociales
- Sede: **Sede Calle 100**
- Tipo de vinculación: **Docente de planta**
- Dedicación: **Medio tiempo**
- Fecha de creación: `03/09/2026`

## Formación

### Pregrado
- Sociología
- Año: `2012`
- Puntos de referencia: **178**

### Especialización
- Especialización en Estudios Sociales
- Clínica: No
- Duración: **NO mostrar campo Duración**
- Año: `2014`
- Puntos de referencia: hasta **20**

### Maestría
- Maestría en Estudios Políticos
- Año: `2018`
- Puntos de referencia: hasta **40**

## Experiencia

### Docencia universitaria
- 2015–2019
- 4 años
- Tiempo parcial
- Probar proporcionalidad por dedicación.

### Investigación
- 2020–2024
- 4 años
- Tiempo completo
- Puntos de referencia: `4 × 6 = 24`

### Dirección académica
- 2024–2025
- 1 año
- Dirección de programa académico
- Puntos de referencia: hasta `4`

## Producción

### Artículo 1
- A1
- Fecha: `18/02/2021`
- ISSN: `2733-3001`
- Puntos: `15`

### Artículo 2
- A1
- Fecha: `10/08/2022`
- ISSN: `2733-3002`
- Puntos: `15`

### Artículo 3
- A2
- Fecha: `03/04/2023`
- ISSN: `2733-3003`
- Puntos: `12`

## Prueba especial

Modificar una experiencia de 4 años a 2 años y comprobar que:

1. disminuyen los puntos;
2. el subtotal cambia;
3. el total cambia;
4. la categoría calculada puede cambiar;
5. el resumen se actualiza.

---

# Perfil 04 — Artes y Humanidades

## Estado

**EN PROCESO**

## Datos personales

- Nombre: **Camilo Esteban Pardo León**
- Identificación: `TEST-1004`
- Área: Artes y Humanidades
- Sede: **Sede Cajicá**
- Tipo de vinculación: **Docente de planta**
- Dedicación: **Tiempo completo**
- Fecha de creación: `03/09/2026`

## Formación

### Pregrado
- Historia
- Año: `2004`
- Puntos de referencia: **178**

### Maestría
- Historia del Arte
- Año: `2008`
- Puntos de referencia: hasta **40**

### Doctorado
- Historia Cultural
- Año: `2015`
- Puntos de referencia: hasta **80**

## Experiencia

### Docencia universitaria
- 2009–2019
- 10 años
- Tiempo completo
- Puntos de prueba: `10 × 4 = 40`

### Investigación
- 2020–2025
- 6 años
- Tiempo completo
- Puntos de prueba: `6 × 6 = 36`

## Producción

### Artículos A1
Registrar **20 artículos A1**, cada uno con:

- Tipo: Artículo completo
- Fecha de publicación obligatoria
- ISSN válido de prueba
- 15 puntos por artículo

Puntaje bruto de artículos:

`20 × 15 = 300`

## Prueba principal: tope

El perfil debe utilizarse para comprobar el tope de productividad de una categoría alta.

Si el sistema determina una categoría cuyo tope sea **320**, el total de productividad debe poder llegar hasta 300 sin ser truncado.

Agregar posteriormente productos adicionales hasta superar el tope y comprobar que:

**El total reconocido nunca supera el tope aplicable.**

---

# Perfil 05 — Administración y Gestión

## Estado

**FINALIZADO**

## Datos personales

- Nombre: **Juliana Marcela Herrera Castro**
- Identificación: `TEST-1005`
- Área: Administración
- Sede: **Sede Calle 100**
- Tipo de vinculación: **Docente de planta**
- Dedicación: **Tiempo completo**
- Fecha de creación: `15/07/2026`
- Estado: **Completado**

## Formación

### Pregrado
- Administración de Empresas
- Año: `2005`
- Puntos de referencia: **178**

### Maestría
- Administración
- Año: `2009`
- Puntos de referencia: hasta **40**

## Experiencia

### Docencia universitaria
- 2010–2017
- 8 años
- Tiempo completo
- Puntos de prueba: `32`

### Dirección académica
- 2018–2021
- 4 años
- Dirección de programa
- Puntos de referencia: hasta `16`

### Experiencia profesional
- 2022–2024
- 3 años
- Consultoría empresarial
- Puntos de prueba: `9`

## Producción

### Artículos
- 4 artículos A2
- `4 × 12 = 48` puntos

### Libro derivado de investigación

- Título: **Gestión estratégica de organizaciones universitarias**
- Tipo: **Libro derivado de investigación**
- Fecha de publicación: `11/05/2024`
- Concepto de pares: **Registrado**
- Puntaje recibido de pares: **27 puntos**
- Puntaje a sumar: **27**

El valor de 27 debe ser **digitado por el usuario** después de registrar el concepto de pares.

## Prueba del libro

Crear una copia del producto y probar:

### Caso A
Concepto de pares = no registrado

Resultado:

`0 puntos`

### Caso B
Concepto de pares = registrado

Puntaje recibido = `27`

Resultado:

`27 puntos`

### Caso C
Modificar puntaje de `27` a `18`

Resultado:

El total debe disminuir automáticamente en `9` puntos.

### Caso D
Eliminar el concepto de pares

Resultado:

El producto vuelve a:

`0 puntos`

---

# Perfil 06 — Ciencias Naturales

## Estado

**FINALIZADO**

## Datos personales

- Nombre: **Ricardo Andrés Molina Vélez**
- Identificación: `TEST-1006`
- Área: Ciencias Naturales
- Sede: **Sede Cajicá**
- Tipo de vinculación: **Docente de planta**
- Dedicación: **Tiempo completo**
- Fecha de creación: `21/06/2026`
- Estado: **Completado**

## Formación

### Pregrado
- Biología
- Año: `2001`
- Puntos: **178**

### Maestría
- Ciencias Biológicas
- Año: `2005`
- Puntos de referencia: **40**

### Doctorado
- Ciencias Biológicas
- Año: `2011`
- Puntos de referencia: **80**

## Experiencia

### Investigación
- 2006–2015
- 10 años
- Tiempo completo
- Puntos de prueba: `60`

### Docencia universitaria
- 2016–2025
- 10 años
- Tiempo completo
- Puntos de prueba: `40`

## Producción

Registrar:

- 15 artículos A1 → `225 puntos`
- 8 artículos A2 → `96 puntos`

Total bruto:

`321 puntos`

## Prueba principal

Si el docente tiene una categoría cuyo tope de productividad sea **320**, el sistema debe reconocer como máximo:

**320 puntos de productividad**

No debe mostrar:

`321`

como productividad reconocida si el tope aplicable es 320.

Debe mostrar claramente:

- Productividad bruta: 321
- Tope aplicable: 320
- Productividad reconocida: 320

Si el diseño actual no contempla mostrar estos tres valores, como mínimo el total reconocido debe respetar el tope.

---

# Perfil 07 — Educación

## Estado

**FINALIZADO**

## Datos personales

- Nombre: **María Fernanda Torres Ruiz**
- Identificación: `TEST-1007`
- Área: Educación
- Sede: **Sede Calle 100**
- Tipo de vinculación: **Docente de planta**
- Dedicación: **Medio tiempo**
- Fecha de creación: `02/05/2026`
- Estado: **Completado**

## Formación

### Pregrado
- Licenciatura en Educación
- Año: `2008`
- Puntos de referencia: **178**

### Especialización
- Especialización en Pedagogía
- No clínica
- El campo Duración (años) **no debe aparecer**.
- Año: `2011`
- Puntos de referencia: hasta **20**

### Maestría
- Educación
- Año: `2015`
- Puntos de referencia: hasta **40**

## Experiencia

### Docencia universitaria
- 2012–2020
- 8 años
- Medio tiempo

### Investigación
- 2021–2024
- 4 años
- Tiempo completo

## Producción

### Artículos
- 3 A1
- 5 A2

Puntaje bruto:

`3 × 15 + 5 × 12 = 105`

## Prueba de dedicación

Modificar temporalmente:

**Medio tiempo → Tiempo completo**

y comprobar que:

- el dato se actualiza;
- la experiencia correspondiente cambia proporcionalmente cuando la regla de cálculo así lo requiera;
- el total se actualiza;
- el resumen cambia;
- el expediente final conserva la dedicación correcta.

---

# Perfil 08 — Ingeniería Industrial / perfil de alto puntaje

## Estado

**FINALIZADO**

## Datos personales

- Nombre: **Santiago Alejandro Gómez Restrepo**
- Identificación: `TEST-1008`
- Área: Ingeniería Industrial
- Sede: **Sede Calle 100**
- Tipo de vinculación: **Docente de planta**
- Dedicación: **Tiempo completo**
- Fecha de creación: `12/04/2026`
- Estado: **Completado**

## Formación

### Pregrado
- Ingeniería Industrial
- Año: `1998`
- Puntos de referencia: **178**

### Especialización
- Gestión de Proyectos
- No clínica
- Año: `2001`
- Duración: **NO mostrar**
- Puntos de referencia: hasta **20**

### Maestría
- Ingeniería Industrial
- Año: `2004`
- Puntos de referencia: hasta **40**

### Doctorado
- Ingeniería
- Año: `2010`
- Puntos de referencia: hasta **80**

## Experiencia

### Docencia universitaria
- 2005–2015
- 11 años
- Tiempo completo
- Puntos de prueba: `44`

### Investigación
- 2016–2025
- 10 años
- Tiempo completo
- Puntos de prueba: `60`

## Producción académica

Registrar:

### 24 artículos A1

Cada artículo:

- Tipo: Artículo completo
- Fecha de publicación obligatoria
- ISSN
- Clasificación A1
- 15 puntos

Total bruto:

`24 × 15 = 360`

### 15 artículos A2

Total:

`15 × 12 = 180`

### Productividad total bruta

`360 + 180 = 540`

## Prueba de tope máximo

Este perfil está diseñado para comprobar el límite de:

**540 puntos de productividad para Profesor Titular**

Si el sistema determina Profesor Titular, el resultado debe poder llegar exactamente a:

**540 puntos**

Posteriormente agregar un artículo A1 adicional:

`540 + 15 = 555`

El sistema debe comprobar que el reconocimiento de productividad **no supere 540**.

Mostrar, si el diseño lo permite:

- Productividad calculada: 555
- Tope: 540
- Productividad reconocida: 540

---

# Matriz de pruebas

| ID | Área | Estado | Dedicación | Formación | Producción | Prueba principal |
|---|---|---|---|---|---|---|
| TEST-1001 | Ingeniería de Software | En proceso | Tiempo completo | Pregrado + Maestría | A1/A2 | Suma desde digitación |
| TEST-1002 | Medicina | En proceso | Tiempo completo | Medicina + Especialización clínica | A1/A2 | Especialización clínica + no convalidado |
| TEST-1003 | Ciencias Sociales | En proceso | Medio tiempo | Pregrado + Esp. + Maestría | A1/A2 | Proporcionalidad |
| TEST-1004 | Artes y Humanidades | En proceso | Tiempo completo | Pregrado + Maestría + Doctorado | 20 A1 | Tope 320 |
| TEST-1005 | Administración | Finalizado | Tiempo completo | Pregrado + Maestría | A2 + libro | Concepto de pares |
| TEST-1006 | Ciencias Naturales | Finalizado | Tiempo completo | Pregrado + Maestría + Doctorado | 15 A1 + 8 A2 | Superar tope |
| TEST-1007 | Educación | Finalizado | Medio tiempo | Pregrado + Esp. + Maestría | A1/A2 | Dedicación |
| TEST-1008 | Ingeniería Industrial | Finalizado | Tiempo completo | Pregrado + Esp. + Maestría + Doctorado | 24 A1 + 15 A2 | Llegar y superar 540 |

---

# Pruebas de comportamiento obligatorias

## 1. Prueba de Inicio

Al abrir **Inicio**:

Debe mostrar únicamente:

- TEST-1001
- TEST-1002
- TEST-1003
- TEST-1004

No debe mostrar:

- TEST-1005
- TEST-1006
- TEST-1007
- TEST-1008

---

## 2. Prueba de Exportar Expedientes

Al abrir **Exportar Expedientes**:

Debe mostrar únicamente:

- TEST-1005
- TEST-1006
- TEST-1007
- TEST-1008

No debe mostrar:

- TEST-1001
- TEST-1002
- TEST-1003
- TEST-1004

---

## 3. Prueba de categoría automática

Para cada perfil:

1. Registrar primero títulos.
2. Registrar experiencia.
3. Registrar producción.
4. Verificar puntos.
5. Llegar al final del workflow.
6. Verificar que **Categoría docente** aparezca únicamente al final.
7. Confirmar que no existe un selector para digitar la categoría.

Modificar experiencia o títulos y comprobar que la categoría pueda actualizarse automáticamente según la lógica implementada.

---

## 4. Prueba de fechas

Todas las fechas deben visualizarse como:

**DD/MM/AAAA**

Ejemplos:

- `03/09/2026`
- `15/05/2021`
- `11/05/2024`

No utilizar:

- `2026-09-03`
- `09/03/2026`
- `September 3, 2026`

---

## 5. Prueba de artículos

Para todos los artículos:

- Tipo de artículo = **Artículo completo**
- Fecha de publicación = obligatoria
- ISSN = disponible
- Fecha en formato DD/MM/AAAA
- Puntos actualizados desde la digitación

Intentar continuar sin fecha de publicación.

Resultado esperado:

**No permitir continuar.**

---

## 6. Prueba de libro derivado de investigación

Probar obligatoriamente los tres estados:

```text
Sin concepto de pares
→ 0 puntos

Concepto registrado + puntaje 27
→ 27 puntos

Concepto eliminado
→ 0 puntos
```

El puntaje recibido de pares debe ser un campo **editable/digitable**, no un valor fijo.

---

## 7. Prueba de título internacional no convalidado

Registrar un título internacional como:

**No convalidado**

Resultado:

**0 puntos**

No mostrar confirmaciones adicionales.

No solicitar documentos de soporte.

---

## 8. Prueba de especialización clínica

Para TEST-1002:

```text
Nivel: Especialización
Clínica: Sí
Duración: 3 años
```

Debe aparecer:

**Duración (años)***

Debe permitir como máximo:

**5**

Intentar ingresar `6`.

Resultado esperado:

**No permitir el valor.**

Para cualquier especialización no clínica:

**No mostrar Duración (años).**

Para maestría, doctorado y pregrado:

**No mostrar Duración (años).**

---

# Prueba de edición y eliminación

Para cualquier registro editable:

## Editar

Al seleccionar editar debe aparecer confirmación antes de modificar información.

Después de confirmar:

- permitir edición;
- recalcular puntos;
- actualizar subtotal;
- actualizar total;
- actualizar categoría si corresponde.

## Eliminar

Al seleccionar eliminar debe aparecer confirmación.

Después de confirmar:

- eliminar;
- recalcular puntos;
- actualizar subtotal;
- actualizar total;
- actualizar resumen.

---

# Prueba del expediente PDF

Utilizar TEST-1005, TEST-1006, TEST-1007 y TEST-1008.

El botón debe decir:

**Descargar Expediente**

El PDF debe incluir:

- Nombre del docente.
- Identificación/código.
- Área.
- Sede.
- Tipo de vinculación.
- Dedicación.
- Formación.
- Experiencia.
- Producción académica.
- Artículos.
- ISSN cuando corresponda.
- Fechas.
- Categoría calculada.
- Puntos por criterio.
- Subtotales.
- Puntaje total.
- Estado final.
- Información relevante del resultado.

## El PDF NO debe incluir:

- Salario.
- Sueldo.
- Remuneración.
- Tiempo empleado en el proceso.
- Duración del workflow.
- Tiempos de inicio/finalización del proceso como métricas de rendimiento.

---

# Prueba de integridad

Figma Make debe mantener estos perfiles como **datos ficticios de prueba** y no mezclarlos con información real.

Los nombres, identificaciones y universidades mencionadas en estos registros son datos de prueba.

No introducir referencias exclusivas de la **Universidad Nacional de Colombia**.

No agregar soportes documentales ni flujos de validación documental.

No agregar modalidades de contratación diferentes de:

- Docente de planta — Tiempo completo
- Docente de planta — Medio tiempo

No agregar sedes diferentes de:

- Sede Calle 100
- Sede Cajicá

---

# Resultado esperado

Después de cargar los 8 perfiles, el prototipo debe permitir verificar de forma visual y funcional:

1. **4 docentes en proceso en Inicio.**
2. **4 docentes completados en Exportar Expedientes.**
3. Cálculo de puntos desde la digitación.
4. Actualización inmediata de subtotales y total.
5. Manejo de experiencia de diferentes tipos y duraciones.
6. Manejo de medio tiempo y tiempo completo.
7. Formación académica variada.
8. Especialización clínica con duración obligatoria y máximo 5 años.
9. Especializaciones no clínicas sin campo de duración.
10. Títulos internacionales no convalidados = 0 puntos.
11. Artículos completos con fecha obligatoria.
12. ISSN disponible.
13. Libros derivados de investigación dependientes del concepto de pares.
14. Puntaje de pares editable.
15. Topes de productividad.
16. Categoría docente calculada al final.
17. Edición con confirmación.
18. Eliminación con confirmación.
19. Expedientes PDF de los docentes completados.
20. PDF sin salario y sin tiempos del proceso.
21. Todas las fechas en DD/MM/AAAA.
22. Ninguna referencia exclusiva de la Universidad Nacional.
