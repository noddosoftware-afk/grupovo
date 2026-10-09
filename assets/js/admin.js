// Grupo VO — panel de administración de solicitudes de cita

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto == null ? "" : String(texto);
  return div.innerHTML;
}

function formatearFecha(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

async function cargarSolicitudes() {
  const contenedor = document.getElementById("contenido-tabla");
  try {
    const solicitudes = await window.sbGrupoVO.sbListAppointmentRequests();
    if (!solicitudes.length) {
      contenedor.innerHTML = '<p class="vacio">No hay solicitudes todavía.</p>';
      return;
    }

    const filas = solicitudes
      .map(
        (s) => `
      <tr data-id="${s.id}">
        <td>${formatearFecha(s.created_at)}</td>
        <td><strong>${escaparHtml(s.nombre)}</strong></td>
        <td><a href="https://wa.me/52${escaparHtml((s.telefono || "").replace(/\D/g, ""))}" target="_blank" rel="noopener">${escaparHtml(s.telefono)}</a></td>
        <td>${escaparHtml(s.servicio)}</td>
        <td>${escaparHtml(s.fecha_preferida) || "—"} ${escaparHtml(s.horario_preferido) || ""}</td>
        <td>${escaparHtml(s.mensaje) || "—"}</td>
        <td>
          <select class="estado-select" data-id="${s.id}">
            <option value="nuevo" ${s.estado === "nuevo" ? "selected" : ""}>Nuevo</option>
            <option value="contactado" ${s.estado === "contactado" ? "selected" : ""}>Contactado</option>
            <option value="agendado" ${s.estado === "agendado" ? "selected" : ""}>Agendado</option>
            <option value="cancelado" ${s.estado === "cancelado" ? "selected" : ""}>Cancelado</option>
          </select>
        </td>
      </tr>`
      )
      .join("");

    contenedor.innerHTML = `
      <div class="tabla-scroll">
        <table class="tabla-solicitudes">
          <thead>
            <tr>
              <th>Recibido</th><th>Nombre</th><th>Teléfono</th><th>Procedimiento</th>
              <th>Fecha/horario preferido</th><th>Comentarios</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>`;

    contenedor.querySelectorAll(".estado-select").forEach((select) => {
      select.addEventListener("change", async () => {
        const id = select.dataset.id;
        try {
          await window.sbGrupoVO.sbUpdateAppointmentRequest(id, { estado: select.value });
        } catch (err) {
          alert("No se pudo actualizar el estado.");
        }
      });
    });
  } catch (err) {
    contenedor.innerHTML = `<p class="vacio">No se pudieron cargar las solicitudes. Vuelve a iniciar sesión.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sesion = window.sbGrupoVO.obtenerSesion();
  if (!sesion) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("btn-salir").addEventListener("click", () => {
    window.sbGrupoVO.sbSignOut();
    window.location.href = "login.html";
  });

  cargarSolicitudes();
});
