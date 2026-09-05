// =====================================================
// LOGOUT
// =====================================================

const logout = document.getElementById("logout");

if (logout) {
  logout.addEventListener("click", function (e) {
    e.preventDefault();

    const confirmar = confirm("🚪 Deseja realmente sair do sistema?");

    if (!confirmar) {
      return;
    }

    // Remove os dados da sessão
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");

    // Volta para a tela de login
    window.location.href = "index.html";
  });
}