const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;

  const senha = document.getElementById("senha").value;

  const mensagem = document.getElementById("mensagem");

  mensagem.textContent = "Entrando...";

  try {
    const resposta = await fetch("/api/auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        senha,
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mensagem.textContent = dados.erro || "Erro ao fazer login";

      return;
    }

    localStorage.setItem("token", dados.token);

    localStorage.setItem("usuario", JSON.stringify(dados.usuario));

    window.location.href = "dashboard.html";
  } catch (erro) {
    mensagem.textContent = "Erro ao conectar ao servidor";
  }
});
