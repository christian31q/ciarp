// ---------------------------------------------------------------------------
// Generador único de documentos imprimibles (A4) del expediente.
// Dos salidas a partir del mismo generador:
//   "th"       → Expediente / soporte para Talento Humano (uso institucional)
//   "profesor" → Valoración para el profesor
// Todo contenido ingresado por usuarios se escapa antes de insertarse en HTML.
// ---------------------------------------------------------------------------
import {
  CRITERIO_SIMULTANEIDAD,
  HORAS_MAX_SEMANALES,
  duracionCalendario,
  fmtDuracion,
  horasNum,
} from "./rules"
import {
  descFormacion,
  enSegundaValoracion,
  etiquetaRevision,
  finEfectivo,
  fmtFecha,
  pendienteConvalidacion,
  puntajeProducto,
  resumenPuntaje,
  tieneMaestriaReconocida,
  type Expediente,
  type TrazaRevision,
} from "./store"

interface ObsItem {
  obs?: string
  ref: string
}

export type VariantePDF = "th" | "profesor"

export function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

const escMultilinea = (v: string) => esc(v).replace(/\n/g, "<br/>")

export function nombreArchivo(exp: Expediente, variante: VariantePDF): string {
  const nombre = (exp.docente.nombre || "Docente")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
  return `${
    variante === "th" ? "Expediente-TalentoHumano" : "Valoracion-Profesor"
  }_${exp.id}_${nombre}`
}

// Etiqueta de envío con color documental + texto (nunca solo color).
function envioCell(r: TrazaRevision, mostrar: boolean): string {
  if (!mostrar) return ""
  const e = etiquetaRevision(r)
  return `<span class="envio envio-${e.tono}">● ${esc(e.label)}</span>`
}
function filaCls(r: TrazaRevision, mostrar: boolean): string {
  if (!mostrar) return ""
  return ` class="row-${etiquetaRevision(r).tono}"`
}

export function generarHTMLExpediente(
  exp: Expediente,
  variante: VariantePDF,
): string {
  const r = resumenPuntaje(exp)
  const d = exp.docente
  const esTH = variante === "th"
  const segunda = enSegundaValoracion(exp)
  const fd = r.formacionDetalle
  const porIdForm = new Map(fd.desglose.map((x) => [x.id, x]))
  const porIdExp = new Map(r.experiencia.detalle.map((x) => [x.id, x]))
  const tm = tieneMaestriaReconocida(exp.formacion)
  const nombreExp = new Map(
    exp.experiencia.map((e) => [e.id, `${e.cargo} · ${e.entidad}`]),
  )

  // ---- Formación ----
  const filaFormacion = exp.formacion
    .map((f) => {
      const des = porIdForm.get(f.id)
      const lugar =
        f.lugar === "Exterior"
          ? `Exterior${f.pais ? ` (${esc(f.pais)})` : ""}${
              pendienteConvalidacion(f)
                ? " · Pendiente de convalidación"
                : f.convalidado === "Sí"
                  ? " · Convalidado"
                  : ""
            }`
          : "Colombia"
      const mat = f.fechaMatriculaProfesional
        ? `<br/><span class="muted">Matrícula profesional: ${fmtFecha(f.fechaMatriculaProfesional)}</span>`
        : ""
      return `<tr${filaCls(f, segunda)}>
        <td><strong>${esc(f.titulo)}</strong><br/><span class="muted">${esc(descFormacion(f, tm).label)}</span>${
          segunda ? `<br/>${envioCell(f, true)}` : ""
        }</td>
        <td>${esc(f.institucion)}<br/><span class="muted">${lugar}</span></td>
        <td>${fmtFecha(f.fechaGrado)}${mat}</td>
        <td class="num">${
          des
            ? (des.reconocido < des.potencial
                ? `<span class="muted strike">${des.potencial}</span> `
                : "") + `<strong>${des.reconocido}</strong>`
            : "<span class='muted'>No puntúa</span>"
        }</td>
      </tr>`
    })
    .join("")

  // ---- Experiencia ----
  const filaExp = exp.experiencia
    .map((e) => {
      const fin = finEfectivo(e)
      const dur = fmtDuracion(duracionCalendario(e.inicio, fin))
      const det = porIdExp.get(e.id)
      const hReg = horasNum(e.horas)
      const hRec = det ? det.horasReconocidas : 0
      const horas = `${hReg.toFixed(2)} h/sem registradas${
        e.horasTotales
          ? `<br/><span class="muted">${esc(e.horasTotales)} h totales certificadas</span>`
          : ""
      }${
        det
          ? `<br/><span class="muted">${hRec.toFixed(2)} h/sem reconocidas${
              det.simultanea ? " · simultánea" : ""
            }</span>`
          : ""
      }`
      return `<tr${filaCls(e, segunda)}>
        <td><strong>${esc(e.entidad)}</strong><br/><span class="muted">Cargo: ${esc(e.cargo)}</span><br/><span class="muted">${esc(e.nivel)} · ${esc(e.dedicacion)}</span>${
          segunda ? `<br/>${envioCell(e, true)}` : ""
        }</td>
        <td>${fmtFecha(e.inicio)} – ${
          e.actualmente ? "Actualidad" : fmtFecha(e.fin)
        }<br/><span class="muted">${dur}</span></td>
        <td>${horas}</td>
        <td class="num">${
          det
            ? `<strong>${det.puntos.toFixed(2)}</strong>`
            : "<span class='muted'>No puntúa</span>"
        }</td>
      </tr>`
    })
    .join("")

  const simult = r.experiencia.simultaneos
    .map(
      (s) =>
        `<li>${fmtFecha(s.inicio)} – ${fmtFecha(s.fin)}: ${s.ids.map((id) => `${esc(nombreExp.get(id) ?? id)} (${(s.reconocidasPorId[id] ?? 0).toFixed(2)} h reconocidas)`).join("; ")}. Registradas conjuntamente: ${s.horasRegistradas.toFixed(2)} h/sem · Reconocidas: ${s.horasReconocidas.toFixed(2)} h/sem.</li>`,
    )
    .join("")

  // ---- Productividad ----
  const filaProd = exp.productividad
    .map((p) => {
      const pts = puntajeProducto(p)
      const pend = p.requierePares && p.conceptoPares !== "Registrado"
      const issn =
        p.tipo === "Artículo"
          ? `ISSN: ${esc(p.issn || "—")}${
              p.issnSecundario
                ? `<br/>ISSN secundario: ${esc(p.issnSecundario)}`
                : ""
            }`
          : "—"
      return `<tr${filaCls(p, segunda)}>
        <td><strong>${esc(p.nombre)}</strong><br/><span class="muted">${esc(p.tipo)}${
          p.subtipo ? ` · ${esc(p.subtipo)}` : ""
        }${p.clasificacion ? ` · ${esc(p.clasificacion)}` : ""}${
          p.fecha ? ` · ${fmtFecha(p.fecha)}` : ""
        }</span>${segunda ? `<br/>${envioCell(p, true)}` : ""}</td>
        <td>${issn}</td>
        <td class="num">${esc(p.autores)}</td>
        <td class="num">${
          pend
            ? "<span class='muted'>Pendiente de pares</span>"
            : `<strong>${pts.toFixed(2)}</strong>`
        }</td>
      </tr>`
    })
    .join("")

  // ---- Observaciones ----
  const obsItems = (titulo: string, items: ObsItem[]) => {
    const con = items.filter((i) => i.obs && i.obs.trim())
    if (!con.length) return ""
    return `<h3>${titulo}</h3><ul class="obs">${con.map((i) => `<li><strong>${esc(i.ref)}:</strong> “${escMultilinea(i.obs!.trim())}”</li>`).join("")}</ul>`
  }
  const obsHTML =
    obsItems(
      "Formación académica",
      exp.formacion.map((f) => ({ obs: f.observacion, ref: f.titulo })),
    ) +
    obsItems(
      "Experiencia",
      exp.experiencia.map((e) => ({
        obs: e.observacion,
        ref: `${e.cargo} · ${e.entidad}`,
      })),
    ) +
    obsItems(
      "Productividad",
      exp.productividad.map((p) => ({ obs: p.observacion, ref: p.nombre })),
    ) +
    (exp.observacionProfesor?.trim()
      ? `<h3>Observación general para el profesor</h3><p class="comment">${escMultilinea(exp.observacionProfesor.trim())}</p>`
      : "") +
    (esTH && exp.comentario?.trim()
      ? `<h3>Observación interna (Talento Humano)</h3><p class="comment">${escMultilinea(exp.comentario.trim())}</p>`
      : "")

  const leyenda = segunda
    ? `<p class="legend"><span class="envio envio-primer">● Primer envío</span> <span class="envio envio-segundo">● Segundo envío</span> <span class="envio envio-excluido">● No tenido en cuenta</span> <span class="envio envio-reemplazado">● Reemplazado por corrección</span></p>`
    : ""

  const hist = (exp.historial ?? [])
    .map(
      (h) =>
        `<tr><td>Valoración ${h.numero} (${esc(h.fecha)})</td><td>${esc(h.categoria)}</td><td class="num">${h.formacion.toFixed(2)}</td><td class="num">${h.experiencia.toFixed(2)}</td><td class="num">${h.productividad.toFixed(2)}</td><td class="num"><strong>${h.total.toFixed(2)}</strong></td></tr>`,
    )
    .join("")
  const histHTML =
    segunda && hist
      ? `<h2>Histórico de valoraciones</h2>
  <table><colgroup><col style="width:24%"/><col style="width:26%"/><col/><col/><col/><col/></colgroup>
    <thead><tr><th>Valoración</th><th>Categoría</th><th class="num">Formación</th><th class="num">Experiencia</th><th class="num">Productividad</th><th class="num">Total</th></tr></thead>
    <tbody>${hist}<tr class="total-row"><td>Valoración ${exp.numeroValoracion ?? 2} (actual)</td><td>${esc(r.categoriaCalculada)}</td><td class="num">${r.formacion.toFixed(2)}</td><td class="num">${r.experiencia.valor.toFixed(2)}</td><td class="num">${r.productividad.valor.toFixed(2)}</td><td class="num">${r.total.toFixed(2)}</td></tr></tbody>
  </table>`
      : ""

  const bitacora =
    esTH && exp.bitacora.length
      ? `<h2>Información de validación (bitácora)</h2>
  <table><colgroup><col style="width:18%"/><col style="width:20%"/><col style="width:22%"/><col/></colgroup>
    <thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead>
    <tbody>${exp.bitacora.map((b) => `<tr><td>${esc(b.fecha)}</td><td>${esc(b.usuario)}<br/><span class="muted">${esc(b.rol)}</span></td><td>${esc(b.accion)}<br/><span class="muted">${esc(b.elemento)}</span></td><td>${esc(b.detalle ?? "")}</td></tr>`).join("")}</tbody>
  </table>`
      : ""

  const detalleFormacionTH =
    esTH && fd.desglose.length
      ? `<p class="note">Regla de formación aplicada: <strong>${esc(fd.reglaAplicada)}</strong> · Tope de la combinación: ${fd.topeCombinacion} pts · Pregrado reconocido: ${fd.pregrado.reconocido} · Posgrados reconocidos: ${fd.posgradoReconocido} de ${fd.posgradoBruto} potenciales (tope global ${fd.topeGlobal}).</p>`
      : ""

  const titulo = esTH
    ? "Expediente de valoración para ingreso docente"
    : "Valoración para ingreso docente"
  const destino = esTH
    ? "Soporte para la División de Gestión del Talento Humano"
    : "Documento para el profesor"

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${esc(nombreArchivo(exp, variante))}</title>
  <style>
    @page { size: A4; margin: 16mm 14mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: "Noto Sans", Arial, sans-serif; font-size: 11px; color: #172033; }
    .header { border-bottom: 3px solid #FEC223; padding-bottom: 10px; margin-bottom: 16px; }
    .inst { font-size: 10px; color: #5F6978; letter-spacing: .05em; text-transform: uppercase; }
    .destino { display: inline-block; margin-top: 6px; padding: 2px 8px; border-radius: 999px; background: #04235F; color: #fff; font-size: 10px; font-weight: 600; }
    h1 { font-size: 17px; color: #04235F; margin: 4px 0 2px; }
    h2 { font-size: 13px; color: #04235F; margin: 18px 0 8px; border-bottom: 1.5px solid #04235F; padding-bottom: 3px; page-break-after: avoid; }
    h3 { font-size: 11.5px; color: #04235F; margin: 10px 0 4px; }
    .sub { font-size: 10px; color: #5F6978; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px 16px; }
    .field label { font-size: 9.5px; color: #5F6978; display: block; }
    .field span { font-size: 11.5px; font-weight: 600; }
    .cat { display: flex; gap: 12px; margin: 4px 0 10px; }
    .box { flex: 1; border-radius: 6px; padding: 10px 12px; background: #04235F; color: #fff; }
    .box.alt { background: #fff; color: #04235F; border: 1.5px solid #04235F; }
    .box .label { font-size: 9.5px; text-transform: uppercase; letter-spacing: .05em; opacity: .75; }
    .box .value { font-size: 16px; font-weight: 700; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 10px; font-size: 10.5px; }
    th { background: #04235F; color: #fff; padding: 5px 6px; text-align: left; font-weight: 600; }
    td { padding: 5px 6px; border-bottom: 1px solid #D9DEE7; vertical-align: top; word-wrap: break-word; overflow-wrap: anywhere; }
    tr { page-break-inside: avoid; }
    .num { text-align: right; }
    .muted { color: #5F6978; font-size: 9.5px; }
    .strike { text-decoration: line-through; }
    .total-row td { font-weight: 700; background: #FEC223; color: #04235F; }
    .note { font-size: 10px; color: #5F6978; margin: 4px 0 8px; }
    .comment { border: 1px solid #D9DEE7; border-radius: 6px; padding: 8px 10px; }
    ul.obs { padding-left: 16px; } ul.obs li { margin-bottom: 3px; }
    ul.sim { padding-left: 16px; font-size: 10px; } ul.sim li { margin-bottom: 3px; }
    .legend { margin: 4px 0 8px; font-size: 10px; }
    .envio { font-size: 9.5px; font-weight: 700; margin-right: 10px; white-space: nowrap; }
    .envio-primer { color: #000; } .envio-segundo { color: #1D4ED8; } .envio-excluido { color: #C00000; } .envio-reemplazado { color: #6B7280; }
    .row-segundo td { color: #1D4ED8; } .row-excluido td { color: #C00000; } .row-reemplazado td { color: #6B7280; }
    .row-segundo .muted { color: #3B63D6; } .row-excluido .muted { color: #C84A4A; }
    .footer { margin-top: 18px; padding-top: 8px; border-top: 1px solid #D9DEE7; font-size: 9.5px; color: #5F6978; }
  </style>
</head>
<body>
  <div class="header">
    <p class="inst">Universidad Militar Nueva Granada · CIARP</p>
    <h1>${titulo}</h1>
    <p class="sub">Decreto 1279 de 2002 · Reglas ${esc(exp.reglasVersion)} · Expediente ${esc(exp.id)}${
      segunda ? ` · Valoración ${exp.numeroValoracion ?? 2}` : ""
    }</p>
    <span class="destino">${destino}</span>
  </div>

  <h2>Identificación del docente</h2>
  <div class="grid">
    <div class="field"><label>Nombre</label><span>${esc(d.nombre || "—")}</span></div>
    <div class="field"><label>Identificación</label><span>${esc(d.identificacion || "—")}</span></div>
    <div class="field"><label>Facultad</label><span>${esc(d.facultad || "—")}</span></div>
    <div class="field"><label>Sede</label><span>${esc(d.sede || "—")}</span></div>
    <div class="field"><label>Tipo de vinculación</label><span>Docente de planta</span></div>
    <div class="field"><label>Dedicación</label><span>${esc(d.dedicacion || "—")}${
      d.dedicacion === "Horas semanales" && d.horasDedicacion
        ? ` · ${esc(d.horasDedicacion)} h/sem registradas${
            horasNum(d.horasDedicacion) > HORAS_MAX_SEMANALES
              ? ` (${HORAS_MAX_SEMANALES} reconocidas)`
              : ""
          }`
        : ""
    }</span></div>
    ${
      esTH
        ? `<div class="field"><label>Fecha de creación</label><span>${fmtFecha(exp.creado)}</span></div><div class="field"><label>Estado del proceso</label><span>${esc(exp.estado)}</span></div>`
        : ""
    }
  </div>

  <h2>Resultado de la valoración</h2>
  <div class="cat">
    <div class="box"><div class="label">Categoría docente calculada</div><div class="value">${esc(r.categoriaCalculada)}</div><div class="label" style="margin-top:4px">${r.categoria} puntos asociados a la categoría</div></div>
    <div class="box alt"><div class="label">Puntaje total</div><div class="value">${r.total.toFixed(2)} pts</div></div>
  </div>
  <table>
    <colgroup><col/><col style="width:28%"/></colgroup>
    <thead><tr><th>Componente</th><th class="num">Puntos reconocidos</th></tr></thead>
    <tbody>
      <tr><td>Formación académica</td><td class="num">${r.formacion.toFixed(2)}</td></tr>
      <tr><td>Categoría docente (${esc(r.categoriaCalculada)})</td><td class="num">${r.categoria.toFixed(2)}</td></tr>
      <tr><td>Experiencia calificada${
        r.experiencia.sinTope > r.experiencia.valor
          ? ` <span class="muted">(tope ${r.experiencia.tope} aplicado; calculado ${r.experiencia.sinTope.toFixed(2)})</span>`
          : ""
      }</td><td class="num">${r.experiencia.valor.toFixed(2)}</td></tr>
      <tr><td>Productividad académica${
        r.productividad.sinTope > r.productividad.valor
          ? ` <span class="muted">(tope ${r.productividad.tope} aplicado; calculado ${r.productividad.sinTope.toFixed(2)})</span>`
          : ""
      }</td><td class="num">${r.productividad.valor.toFixed(2)}</td></tr>
      <tr class="total-row"><td>Puntaje total</td><td class="num">${r.total.toFixed(2)}</td></tr>
    </tbody>
  </table>
  ${histHTML}

  ${leyenda ? `<h2>Convención de la segunda valoración</h2>${leyenda}` : ""}

  ${
    exp.formacion.length
      ? `<h2>Formación académica</h2>${detalleFormacionTH}
  <table><colgroup><col style="width:40%"/><col style="width:30%"/><col style="width:17%"/><col style="width:13%"/></colgroup>
    <thead><tr><th>Título / nivel</th><th>Institución / lugar</th><th>Finalización</th><th class="num">Puntos</th></tr></thead>
    <tbody>${filaFormacion}</tbody>
  </table>`
      : ""
  }

  ${
    exp.experiencia.length
      ? `<h2>Experiencia calificada</h2>
  <table><colgroup><col style="width:38%"/><col style="width:22%"/><col style="width:27%"/><col style="width:13%"/></colgroup>
    <thead><tr><th>Entidad / cargo / actividad</th><th>Periodo y duración</th><th>Horas</th><th class="num">Puntos</th></tr></thead>
    <tbody>${filaExp}</tbody>
  </table>
  ${
    simult
      ? `<h3>Periodos con simultaneidad detectada</h3><ul class="sim">${simult}</ul><p class="note">${esc(CRITERIO_SIMULTANEIDAD)}</p>`
      : ""
  }`
      : ""
  }

  ${
    exp.productividad.length
      ? `<h2>Productividad académica</h2>
  <table><colgroup><col style="width:50%"/><col style="width:26%"/><col style="width:10%"/><col style="width:14%"/></colgroup>
    <thead><tr><th>Producto</th><th>ISSN</th><th class="num">Autores</th><th class="num">Puntos</th></tr></thead>
    <tbody>${filaProd}</tbody>
  </table>`
      : ""
  }

  ${obsHTML ? `<h2>Observaciones</h2>${obsHTML}` : ""}

  ${bitacora}

  <p class="footer">
    ${
      esTH
        ? "Documento de soporte institucional generado por el sistema de valoración para el ingreso docente. El sistema calcula y presenta resultados; no sustituye la decisión del Comité Interno ni el acto administrativo de reconocimiento de puntos."
        : "Este documento presenta el resultado calculado de su valoración para el ingreso docente. No constituye acto administrativo; la decisión corresponde al Comité Interno de Asignación y Reconocimiento de Puntaje (CIARP)."
    }
  </p>
</body>
</html>`
}

// Imprime/guarda como PDF sin salir de la vista (iframe oculto).
export function descargarDocumento(exp: Expediente, variante: VariantePDF) {
  const html = generarHTMLExpediente(exp, variante)
  const iframe = document.createElement("iframe")
  Object.assign(iframe.style, {
    position: "fixed",
    right: "0",
    bottom: "0",
    width: "0",
    height: "0",
    border: "0",
  })
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument ?? iframe.contentWindow?.document
  if (!doc) {
    document.body.removeChild(iframe)
    return
  }
  doc.open()
  doc.write(html)
  doc.close()
  iframe.contentWindow?.focus()
  setTimeout(() => {
    iframe.contentWindow?.print()
    setTimeout(() => document.body.removeChild(iframe), 500)
  }, 250)
}
