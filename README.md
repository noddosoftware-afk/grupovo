# Grupo VO — Landing page + agendador de citas

Proyecto de [NODDO Software](https://github.com/noddosoftware-afk) para **Grupo VO**, clínica de oftalmología y salud visual en León, Gto. (LASIK, estrabismo, crosslinking corneal, cirugía de catarata).

## Qué incluye

- **`index.html`** — landing page: hero, especialidades, por qué elegirlos, proceso, formulario de agenda, ubicación/contacto. HTML/CSS/JS plano, sin frameworks ni build step (igual que los demás sitios de Noddo).
- **Formulario de "Agendar cita"** — guarda la solicitud directo en Supabase (tabla `appointment_requests`), sin depender de WhatsApp. El botón de WhatsApp sigue disponible como alternativa para atención inmediata.
- **`admin.html` + `login.html`** — panel interno para que recepción vea y gestione las solicitudes (nuevo / contactado / agendado / cancelado). Protegido con Supabase Auth + tabla `admins` (solo cuentas dadas de alta ahí pueden entrar).

## Backend

Proyecto Supabase **`grupovo-prod`** (org Noddo Software, id `jwpaspahholqczgqxcib`).

- Tabla `appointment_requests`: cualquier visitante puede insertar (RLS `to public, with check (true)`); solo admins autenticados pueden leer/actualizar (`is_admin()` vía tabla `admins`).
- Cuenta admin temporal: `admin@grupovo.com.mx` / contraseña entregada por separado — **rotar y reemplazar por el correo real de recepción antes de entregar el sitio al cliente**.
- Claves públicas en `assets/js/supabase.js` (anon/publishable key — normal exponerla en frontend, el acceso real está controlado por RLS, no por ocultar la key).

## Pendiente / próximos pasos

- **Integración con el sistema de gestión de pacientes que ya usa Grupo VO** (altas, procedimientos, pagos): por ahora el agendador vive en paralelo (base de datos propia + notificación a recepción). Falta identificar el software exacto que usan y si tiene API/exportación para conectar de verdad las citas confirmadas a su sistema. No bloquea el lanzamiento del sitio.
- Confirmar con el cliente: equipo médico/doctores a mostrar, testimonios reales de pacientes (no se incluyeron testimonios inventados). Las fotos actuales (`assets/img/`) son **stock genérico de Unsplash** (temática oftalmología/clínica, sin marcas ni personas identificables) usadas solo como placeholder visual — reemplazar por fotos reales de la clínica en cuanto el cliente las proporcione.
- Una vez confirmado el dominio real, actualizar metadatos OG y considerar agregar `sitemap.xml`.

## Deploy

Pensado para Vercel (sin configuración especial, sitio estático). `vercel.json` incluye headers de seguridad (CSP, HSTS, etc.) siguiendo el mismo patrón que `miperfumeria`.
