document.getElementById("formLogin").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  const modal = document.getElementById("popupModal");
  const modalContent = modal.querySelector(".modal-content");

  if (email && senha) {
    // Mensagem de sucesso
    modalContent.innerHTML = `
      <h2>✅ Login encontrado!</h2>
      <p>Bem-vindo ao SIGEAS</p>
      <button id="continuarBtn">Continuar</button>
    `;
    modal.style.display = "flex";

    // Redireciona ao clicar
    document.getElementById("continuarBtn").onclick = () => {
      window.location.href = "dashboard.html";
    };
  } else {
    // Mensagem de erro
    modalContent.innerHTML = `
      <h2>❌ Erro</h2>
      <p>Por favor, preencha todos os campos.</p>
      <button id="fecharBtn">Tentar novamente</button>
    `;
    modal.style.display = "flex";

    // Fecha popup
    document.getElementById("fecharBtn").onclick = () => {
      modal.style.display = "none";
    };
  }
});
