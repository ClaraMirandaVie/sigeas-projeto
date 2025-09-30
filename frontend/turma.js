async function authFetch(url, opts = {}) {
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';
  const token = sessionStorage.getItem('token');
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(url, opts);
  if (res.status === 401) {
    sessionStorage.clear();
    window.location = 'login.html';
    return null;
  }
  return res;
}

async function loadTurmas() {
  const res = await authFetch('http://localhost:3000/turmas');
  if (!res) return;
  const data = await res.json();
  const list = document.getElementById('turmas-list');
  list.innerHTML = '';
  data.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.nome + (t.descricao ? ' — ' + t.descricao : '');
    list.appendChild(li);
  });

  // populate selects in alunos & chamada pages
  const turmaSelect = document.getElementById('aluno-turma');
  if (turmaSelect) {
    turmaSelect.innerHTML = '<option value="">--turma (opcional)--</option>';
    data.forEach(t => {
      const o = document.createElement('option');
      o.value = t.id;
      o.textContent = t.nome;
      turmaSelect.appendChild(o);
    });
  }
  const chamadaSelect = document.getElementById('chamada-turma');
  if (chamadaSelect) {
    chamadaSelect.innerHTML = '<option value="">--selecione--</option>';
    data.forEach(t => {
      const o = document.createElement('option');
      o.value = t.id;
      o.textContent = t.nome;
      chamadaSelect.appendChild(o);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-turma-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('turma-nome').value;
      const descricao = document.getElementById('turma-descricao').value;
      const res = await authFetch('http://localhost:3000/turmas', { method: 'POST', body: JSON.stringify({ nome, descricao }) });
      if (res && res.ok) {
        document.getElementById('turma-msg').textContent = 'Criado com sucesso';
        form.reset();
        loadTurmas();
      } else {
        const txt = res ? await res.text() : 'Erro';
        document.getElementById('turma-msg').textContent = 'Erro: ' + txt;
      }
    });
  }
  loadTurmas();
});
