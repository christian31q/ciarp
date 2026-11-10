# Correcciones adicionales para Figma Make

Aplica estas correcciones **sobre el prototipo existente**. No reconstruyas la plataforma desde cero y no cambies innecesariamente la identidad visual, navegación, componentes, estilos ni estructura que ya funcionan.

Estas modificaciones deben integrarse con las reglas establecidas anteriormente.

---

# 1. Separación de registros en "Inicio" y "Exportar Expedientes"

## Inicio

La sección **"Inicio"** debe mostrar **únicamente los docentes cuyo proceso de valoración se encuentra actualmente en proceso**.

No mostrar docentes cuyo proceso ya esté completado.

Cada registro en Inicio debe permitir continuar o revisar el proceso de valoración que aún está pendiente.

Los estados que correspondan a procesos terminados deben quedar fuera de esta vista.

### Regla

```text
INICIO
└── Mostrar únicamente:
    ├── Docente A — En proceso
    ├── Docente B — En proceso
    └── Docente C — En proceso

NO mostrar:
    ├── Docente D — Completado
    └── Docente E — Completado
```

---

## Exportar Expedientes

La sección debe llamarse:

**"Exportar Expedientes"**

Esta sección debe mostrar **únicamente los docentes cuyo proceso de valoración esté completado**.

No mostrar docentes que todavía estén en proceso.

### Regla

```text
EXPORTAR EXPEDIENTES
└── Mostrar únicamente:
    ├── Docente D — Completado
    ├── Docente E — Completado
    └── Docente F — Completado

NO mostrar:
    ├── Docente A — En proceso
    └── Docente B — En proceso
```

La separación debe ser estricta:

**Inicio = En proceso**

**Exportar Expedientes = Completados**

---

# 2. Expediente PDF de docentes completados

La opción **"Descargar Expediente"** debe continuar generando el PDF con la información completa disponible del docente y de su valoración.

Sin embargo, realizar estas modificaciones:

## Eliminar tiempos del proceso

No incluir en el PDF:

- Tiempo de inicio.
- Tiempo de finalización.
- Duración del proceso.
- Tiempo total.
- Cualquier métrica relacionada con cuánto tardó el proceso.

Eliminar completamente cualquier sección denominada **"Tiempos del proceso"**.

## No incluir salario

El expediente PDF **NO debe mostrar información salarial**.

Eliminar:

- Salario.
- Sueldo.
- Remuneración.
- Valor salarial.
- Cualquier campo relacionado con ingresos económicos del docente.

No reemplazar estos datos por valores ficticios.

### El expediente debe centrarse en:

- Información del docente.
- Sede.
- Vinculación.
- Dedicación.
- Experiencia.
- Formación académica.
- Producción académica/investigativa registrada.
- Criterios evaluados.
- Puntos obtenidos.
- Subtotales.
- Puntaje total.
- Resultado final.
- Fechas relevantes de la valoración.

Mantener todas las fechas en formato **DD/MM/AAAA**.

---

# 3. ISSN vuelve a "Nueva valoración"

Restaurar el campo:

**"ISSN"**

dentro de la sección correspondiente de **"Nueva valoración"**.

El ISSN vuelve a formar parte de la información del artículo.

Debe poder:

- Visualizarse.
- Digitarse.
- Guardarse.
- Mostrarse posteriormente en el resumen y expediente cuando corresponda.

No convertirlo necesariamente en un campo obligatorio a menos que ya exista una regla específica que lo indique.

Mantener el resto de campos y comportamiento de la sección de artículos.

---

# 4. "Categoría docente" no es un dato digitado

Modificar completamente el comportamiento de **"Categoría docente"**.

La categoría docente **NO debe ser digitada manualmente por el usuario**.

Debe ser un **resultado calculado por el sistema** a partir de la información registrada previamente sobre:

- Experiencia.
- Títulos / formación académica.
- Los demás datos que correspondan según las reglas de valoración existentes.

## Ubicación

La categoría docente debe moverse **hasta el final del workflow de valoración**.

No mostrarla como un campo editable al inicio del proceso.

El flujo debe ser:

```text
Datos del docente
        ↓
Experiencia
        ↓
Títulos / formación académica
        ↓
Producción / demás criterios
        ↓
Cálculo de puntos
        ↓
Determinación automática
        ↓
Categoría docente
        ↓
Resumen final
```

## Comportamiento

El sistema debe determinar la categoría utilizando los datos que el usuario ya digitó.

La categoría debe:

- Ser calculada automáticamente.
- No tener campo de edición manual.
- No tener selector para que el usuario escoja una categoría.
- Actualizarse si se modifican los datos de experiencia o títulos.
- Mostrarse al final del workflow.
- Aparecer también en el resumen final.
- Aparecer en el expediente PDF cuando corresponda.

Visualmente puede presentarse como un resultado informativo:

```text
Categoría docente

Calculada automáticamente a partir de la experiencia
y formación académica registrada.

[ CATEGORÍA CALCULADA ]
```

No mostrar:

```text
Categoría docente *
[ Seleccionar categoría ▼ ]
```

---

# 5. Libro derivado de investigación

Modificar el comportamiento del criterio:

**"Libro derivado de investigación"**

Este criterio depende del **concepto de pares**.

## Sin concepto de pares = 0 puntos

Si todavía **no se ha registrado el concepto de pares**, el libro **no debe sumar puntos**.

El sistema debe mostrar:

```text
Concepto de pares
[ Registrar concepto ]

Puntaje actual
0 puntos
```

Mientras no exista concepto registrado:

- El puntaje debe permanecer en **0**.
- No asignar automáticamente un puntaje.
- No asumir que el libro cumple el criterio.
- No utilizar un valor fijo predeterminado.

---

## Puntaje recibido de pares

Una vez registrado el concepto de pares, el sistema debe permitir **digitar el puntaje recibido de los pares**.

El valor debe introducirse directamente en el formulario, debajo de la casilla para registrar el concepto.

Ejemplo:

```text
Concepto de pares
[ Registrar concepto ]

Puntaje recibido de pares
[ __________ ] puntos

Puntaje obtenido
XX puntos
```

El puntaje **NO debe ser un valor fijo preestablecido por el prototipo**.

El valor utilizado para la valoración debe corresponder al puntaje que se digite según lo recibido de los pares.

### Comportamiento

```text
NO hay concepto de pares
        ↓
Puntaje = 0

Se registra concepto de pares
        ↓
Se habilita "Puntaje recibido de pares"
        ↓
Usuario digita el puntaje
        ↓
Sistema actualiza el puntaje
        ↓
Se suma al total de valoración
```

Si el puntaje digitado cambia, el total debe actualizarse inmediatamente.

Si el concepto de pares se elimina, el puntaje asociado debe volver a **0** y dejar de sumar al total.

---

# 6. Título internacional no convalidado

Modificar el comportamiento de:

**"Título internacional no convalidado"**

Un título internacional **no convalidado no debe generar puntos**.

Por lo tanto:

```text
Título internacional no convalidado
→ 0 puntos
```

No debe sumarse ningún puntaje por este concepto.

## Sin confirmaciones adicionales

El usuario **NO debe tener que confirmar nada adicional** para registrar esta condición.

No agregar:

- Modal de confirmación.
- Checkbox de confirmación.
- Mensaje de "¿Está seguro?".
- Validación adicional.
- Solicitud de documento de convalidación.
- Campo adicional para justificar la ausencia de convalidación.

Simplemente registrar la información correspondiente y aplicar:

**0 puntos**.

El sistema debe poder continuar normalmente con el workflow.

---

# 7. Duración en años para especialización clínica

Modificar el campo **"Duración (años)"** dentro de los niveles de formación.

Este campo debe existir **únicamente cuando la formación corresponda a una especialización clínica**.

## Especialización clínica

Cuando el usuario seleccione:

**Especialización + Clínica**

hacer obligatorio:

**Duración (años)**

El campo debe estar limitado a un máximo de:

**5 años**

Ejemplo:

```text
Nivel de formación
[ Especialización ]

Tipo
[ Clínica ]

Duración (años) *
[ 1 ]

Máximo permitido: 5 años
```

Valores permitidos:

```text
1
2
3
4
5
```

No permitir valores superiores a 5.

---

## Resto de niveles de formación

Eliminar **"Duración (años)"** de los demás niveles de formación.

No mostrar este campo para:

- Pregrado.
- Especialización no clínica.
- Maestría.
- Doctorado.
- Otros niveles que existan en el prototipo.

La lógica debe ser:

```text
¿Es Especialización?
       │
       ├── NO → No mostrar duración
       │
       └── SÍ
            │
            ├── ¿Es clínica?
            │       │
            │       ├── SÍ → Mostrar Duración (años), obligatorio, máximo 5
            │       │
            │       └── NO → No mostrar Duración
```

No dejar el campo visible y deshabilitado; simplemente **ocultarlo cuando no corresponda**.

---

# 8. Eliminar cualquier referencia exclusiva de la Universidad Nacional

Revisar todo el prototipo y eliminar u omitir cualquier elemento que sea **exclusivo de la Universidad Nacional** y que no corresponda al sistema actual.

Esto aplica a:

- Nombres.
- Logos.
- Instituciones.
- Reglamentos.
- Textos.
- Ejemplos.
- Datos de prueba.
- Categorías.
- Reglas.
- Referencias institucionales.
- Campos.
- Mensajes.
- Información académica.
- Cualquier contenido que identifique específicamente a la Universidad Nacional.

**No incorporar información de la Universidad Nacional como referencia institucional del sistema.**

Si existe contenido genérico que puede mantenerse sin mencionar a la Universidad Nacional, conservarlo.

La plataforma debe utilizar únicamente la información institucional correspondiente al proyecto actual.

### Regla importante

No sustituir automáticamente un texto de la Universidad Nacional por otro texto inventado.

Si un elemento es exclusivo de la Universidad Nacional y no tiene una equivalencia definida en el prototipo actual, **eliminarlo**.

---

# 9. Integración con el cálculo de puntos

Todas estas modificaciones deben respetar la regla existente de que los puntos se calculan **desde la digitación**.

Por lo tanto:

- Los puntos de experiencia deben actualizarse al registrar/modificar experiencia.
- Los puntos de formación deben actualizarse al registrar/modificar títulos.
- El libro derivado de investigación debe sumar únicamente cuando exista concepto de pares y se haya registrado el puntaje correspondiente.
- El título internacional no convalidado debe aportar 0 puntos.
- Los cambios en formación o experiencia deben poder modificar la categoría docente calculada.
- El puntaje total debe actualizarse inmediatamente después de cualquier cambio relevante.

No esperar hasta el último paso para realizar el cálculo.

---

# 10. Revisión final del workflow

Verificar el flujo completo:

```text
Inicio
  ↓
Docente en proceso
  ↓
Nueva valoración
  ↓
Información del docente
  ↓
Experiencia
  ↓
Formación académica
  ↓
Producción académica / investigativa
  ↓
Cálculo continuo de puntos
  ↓
Categoría docente calculada automáticamente
  ↓
Resumen final
  ↓
Completar valoración
  ↓
Docente pasa a "Exportar Expedientes"
  ↓
Descargar Expediente
  ↓
PDF completo
```

Cuando la valoración se complete:

- El docente debe desaparecer de **Inicio**.
- El docente debe aparecer en **Exportar Expedientes**.
- Debe poder utilizarse **"Descargar Expediente"**.
- El PDF no debe incluir tiempos del proceso.
- El PDF no debe incluir salario.
- El PDF debe incluir los datos y puntajes finales correspondientes.
- Las fechas deben mantenerse en formato **DD/MM/AAAA**.

## Criterio general

Implementar únicamente las modificaciones indicadas y conservar el resto del prototipo funcional.

**No introducir campos, documentos, validaciones, instituciones, categorías o reglas que no estén contempladas en estas instrucciones o en las reglas ya establecidas del prototipo.**