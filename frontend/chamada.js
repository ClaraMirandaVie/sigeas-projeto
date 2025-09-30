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

async function loadTurmasIntoSelect(selectId) {
  const res = await authFetch('http://localhost:3000/turmas');
  if (!res) return;
  const data = await res.json();
  const sel = document.getElementById(selectId);
  sel.innerHTML = '<option value="">--selecione--</option>';
  data.forEach(t => {
    const o = document.createElement('option');
    o.value = t.id;
    o.textContent = t.nome;
    sel.appendChild(o);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadTurmasIntoSelect('chamada-turma');

  document.getElementById('chamada-turma').addEventListener('change', async (e) => {
    const turmaId = parseInt(e.target.value);
    const container = document.getElementById('alunos-checkboxes');
    container.innerHTML = '';
    if (!turmaId) return;
    const token = sessionStorage.getItem('token');
    const res = await fetch('http://localhost:3000/turmas/' + turmaId + '/alunos', {
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      container.textContent = 'Erro ao carregar alunos';
      return;
    }
    const alunos = await res.json();
    alunos.forEach(a => {
      const div = document.createElement('div');
      div.innerHTML = `<label><input type="checkbox" name="presente" value="${a.id}" /> ${a.nome}</label>`;
      container.appendChild(div);
    });
  });

  const form = document.getElementById('chamada-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const turma_id = parseInt(document.getElementById('chamada-turma').value);
      const dataVal = document.getElementById('chamada-data').value;
      const presentesEls = document.querySelectorAll('input[name="presente"]:checked');
      const presentes = Array.from(presentesEls).map(ch => parseInt(ch.value));
      const res = await authFetch('http://localhost:3000/chamada', { method: 'POST', body: JSON.stringify({ turma_id, data: dataVal, presentes }) });
      if (res && res.ok) {
        alert('Chamada registrada');
      } else {
        alert('Erro ao registrar chamada');
      }
    });
  }
});
