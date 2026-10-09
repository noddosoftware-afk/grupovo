document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const error = document.getElementById("login-error");
  error.style.display = "none";
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  try {
    await window.sbGrupoVO.sbSignIn(email, password);
    window.location.href = "admin.html";
  } catch (err) {
    error.textContent = "Correo o contraseña incorrectos.";
    error.style.display = "block";
  }
});
