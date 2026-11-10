# Especificaciones de Actualización - UI/UX Figma Make

Este documento detalla los cambios y ajustes visuales y de flujo requeridos para la siguiente versión del prototipo en Figma Make.

---

## 1. Ajustes en la Pantalla de Login (Escritorio / PC)
* **Problema actual:** El contenedor del formulario de inicio de sesión se muestra demasiado pequeño o desproporcionado en pantallas horizontales de PC (Desktop/Wide screens).
* **Requerimiento:**
  * Rediseñar la distribución adaptativa (Auto Layout / Responsive Constraints) para resoluciones de escritorio (1440px+ y 1920px+).
  * Ajustar el tamaño del contenedor principal del login, padding e hipervínculos/botones para mejorar la legibilidad y la jerarquía visual en monitores grandes.
  * Mantener el centrado óptimo (vertical y horizontal) o una distribución balanceada de dos columnas (ej. Ilustración/Branding a la izquierda y Formulario a la derecha).

---

## 2. Indicadores de Pasos en el Encabezado del Expediente
* **Problema actual:** Los indicadores en la cabecera solo muestran números (ej. `1`, `2`, `3`), lo que resta claridad al usuario sobre la etapa actual.
* **Requerimiento:**
  * Incorporar el **nombre/título de cada paso** junto o debajo de su número correspondiente en el Stepper/Header.
  * **Ejemplo de estructura:**
    * Paso 1: *Datos Personales*
    * Paso 2: *Documentación / Requisitos*
    * Paso 3: *Revisión y Firma*
  * Asegurar que el estado (Activo, Completado, Pendiente) se refleje claramente visualmente tanto en el número como en el texto del paso.

---

## 3. Renombrar Sección "Exportar expediente"
* **Problema actual:** El término "Exportar expediente" no refleja con precisión el propósito de la sección.
* **Requerimiento:**
  * Cambiar el texto de la etiqueta/botón/sección a: **"Ver procesos completados"**.
  * Actualizar la iconografía asociada si es necesario para alinearse mejor con la consulta/visualización de procesos finalizados en lugar de una descarga masiva.

---

## 4. Navegación y Botones de Retorno en Edición de Expediente (Docente)
* **Problema actual:** Al estar revisando/editando el expediente de un profesor, solo existen las opciones de "Guardar borrador" y "Siguiente", dificultando la navegación hacia atrás o al inicio.
* **Requerimiento:**
  * **Botón "Regresar a Casa / Inicio" (Home):**
    * Añadir un botón accesible en la barra superior o navegación principal que permita volver al Dashboard/Inicio del sistema.
  * **Botón / Icono de "Volver" (Atrás):**
    * Incluir un control explícito de navegación hacia la vista/pantalla anterior (ej. icono de flecha hacia la izquierda `← Volver`).
  * **Ubicación:** Ubicar los controles en la parte superior izquierda o en la barra de acciones principal del expediente para evitar interferir con la barra fija inferior de navegación por pasos ("Guardar borrador" / "Siguiente").