// Grupo VO — cliente REST ligero para Supabase (sin SDK externo)

const SUPABASE_URL = "https://jwpaspahholqczgqxcib.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4jHXIhm9ohUzOefUwaw-ag_C_AlfV85";

function sbHeaders(extra) {
  return Object.assign(
    {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: "Bearer " + SUPABASE_ANON_KEY,
    },
    extra || {}
  );
}

async function sbInsertAppointmentRequest(payload) {
  // return=minimal: el rol público no tiene permiso de SELECT sobre esta tabla
  // (solo admins autenticados pueden leer), así que no se le puede regresar la fila insertada.
  const res = await fetch(`${SUPABASE_URL}/rest/v1/appointment_requests`, {
    method: "POST",
    headers: sbHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const texto = await res.text().catch(() => "");
    throw new Error("No se pudo guardar la solicitud: " + texto);
  }
}

const SESSION_KEY = "vo_admin_session";

function guardarSesion(sesion) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
}

function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function borrarSesion() {
  localStorage.removeItem(SESSION_KEY);
}

async function sbSignIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: sbHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const datos = await res.json();
  if (!res.ok) throw new Error(datos.error_description || datos.msg || "No se pudo iniciar sesión");
  guardarSesion(datos);
  return datos;
}

function sbSignOut() {
  borrarSesion();
}

function sbAuthHeaders() {
  const sesion = obtenerSesion();
  if (!sesion) return null;
  return sbHeaders({ Authorization: "Bearer " + sesion.access_token });
}

async function sbListAppointmentRequests() {
  const headers = sbAuthHeaders();
  if (!headers) throw new Error("No hay sesión activa");
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/appointment_requests?select=*&order=created_at.desc`,
    { headers }
  );
  if (!res.ok) throw new Error("No se pudieron cargar las solicitudes");
  return res.json();
}

async function sbUpdateAppointmentRequest(id, cambios) {
  const headers = sbAuthHeaders();
  if (!headers) throw new Error("No hay sesión activa");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/appointment_requests?id=eq.${id}`, {
    method: "PATCH",
    headers: Object.assign(headers, { Prefer: "return=representation" }),
    body: JSON.stringify(cambios),
  });
  if (!res.ok) throw new Error("No se pudo actualizar la solicitud");
  return res.json();
}

window.sbGrupoVO = {
  sbInsertAppointmentRequest,
  sbSignIn,
  sbSignOut,
  sbListAppointmentRequests,
  sbUpdateAppointmentRequest,
  obtenerSesion,
};
