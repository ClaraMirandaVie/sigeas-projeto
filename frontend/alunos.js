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

async function loadAlunos() {
  const res = await authFetch('http://localhost:3000/alunos');
  if (!res) return;
  const data = await res.json();
  const list = document.getElementById('alunos-list');
  list.innerHTML = '';
  data.forEach(a => {
    const li = document.createElement('li');
    li.textContent = a.nome + (a.email ? ' (' + a.email + ')' : '') + (a.turma_id ? ' — turma: ' + a.turma_id : '');
    list.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-aluno-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('aluno-nome').value;
      const email = document.getElementById('aluno-email').value;
      const turma_id = document.getElementById('aluno-turma').value || null;
      const body = { nome, email, turma_id: turma_id ? parseInt(turma_id) : null };
      const res = await authFetch('http://localhost:3000/alunos', { method: 'POST', body: JSON.stringify(body) });
      if (res && res.ok) {
        form.reset();
        loadAlunos();
      } else {
        alert('Erro ao criar aluno');
      }
    });
  }
  loadAlunos();
});
