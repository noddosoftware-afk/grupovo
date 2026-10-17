// Grupo VO — interacciones de la landing page

document.addEventListener("DOMContentLoaded", () => {
  // Menú móvil
  const navToggle = document.querySelector(".nav-toggle");
  const menuMovil = document.querySelector(".menu-movil");
  if (navToggle && menuMovil) {
    navToggle.addEventListener("click", () => {
      menuMovil.classList.toggle("abierto");
    });
    menuMovil.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menuMovil.classList.remove("abierto"))
    );
  }

  // Botones "Agendar cita": hacen scroll al formulario y precargan el servicio
  const abrirBtns = document.querySelectorAll("[data-abrir-agenda]");
  abrirBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (btn.dataset.servicio) {
        const select = document.getElementById("campo-servicio");
        if (select) select.value = btn.dataset.servicio;
      }
      setTimeout(() => {
        const nombre = document.getElementById("campo-nombre");
        if (nombre) nombre.focus({ preventScroll: true });
      }, 500);
    })
  );

  // Envío del formulario de agenda
  const form = document.getElementById("form-agenda");
  const exito = document.getElementById("form-exito");
  const error = document.getElementById("form-error");

  // Botón "Agendar por WhatsApp": arma el mensaje con lo que el usuario ya
  // haya escrito en el formulario, sin obligarlo a repetirlo.
  const btnWa = document.getElementById("btn-agenda-whatsapp");
  if (form && btnWa) {
    const actualizarWa = () => {
      const nombre = form.nombre.value.trim();
      const servicio = form.servicio.value;
      const fecha = form.fecha.value;
      const horario = form.horario.value;
      const lineas = ["Hola, quiero agendar una cita en Grupo VO."];
      if (nombre) lineas.push(`Nombre: ${nombre}`);
      if (servicio) lineas.push(`Procedimiento de interés: ${servicio}`);
      if (fecha) lineas.push(`Fecha preferida: ${fecha}`);
      if (horario) lineas.push(`Horario preferido: ${horario}`);
      btnWa.href = "https://wa.me/5214774038972?text=" + encodeURIComponent(lineas.join("\n"));
    };
    actualizarWa();
    form.addEventListener("input", actualizarWa);
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      exito.style.display = "none";
      error.style.display = "none";

      const datos = {
        nombre: form.nombre.value.trim(),
        telefono: form.telefono.value.trim(),
        email: form.email.value.trim() || null,
        servicio: form.servicio.value,
        fecha_preferida: form.fecha.value || null,
        horario_preferido: form.horario.value || null,
        mensaje: form.mensaje.value.trim() || null,
      };

      const btnSubmit = form.querySelector('button[type="submit"]');
      const textoOriginal = btnSubmit.textContent;
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Enviando...";

      try {
        await window.sbGrupoVO.sbInsertAppointmentRequest(datos);
        exito.textContent =
          "¡Listo! Recibimos tu solicitud. Nuestro equipo te contactará muy pronto para confirmar tu cita.";
        exito.style.display = "block";
        form.reset();
      } catch (err) {
        console.error(err);
        error.textContent =
          "No pudimos enviar tu solicitud por este medio. Escríbenos directo por WhatsApp y te atendemos de inmediato.";
        error.style.display = "block";
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = textoOriginal;
      }
    });
  }

  // Header con sombra al hacer scroll
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) header.style.boxShadow = "0 4px 20px -8px rgba(11,46,79,0.15)";
    else header.style.boxShadow = "none";
  });
});
