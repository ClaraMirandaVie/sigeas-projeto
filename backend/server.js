// Backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('./db');

const JWT_SECRET = 'troque_este_segredo_em_producao'; // se quiser, altere

const app = express();
app.use(cors());
app.use(bodyParser.json());

// inicializa e tenta seed
(async () => {
  try {
    await db.getPool();
    await db.seedIfNeeded();
  } catch (err) {
    console.error('Erro conectando DB:', err.message);
  }
})();

// helpers
async function getUserByUsername(username) {
  const rows = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows && rows[0] ? rows[0] : (rows.length ? rows[0] : null);
}

// middlewares
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
function authorize(roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

// --- Auth ---
app.post('/login', body('username').notEmpty(), body('password').notEmpty(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// --- Users (admin) ---
app.get('/users', authenticate, authorize(['admin']), async (req, res) => {
  const rows = await db.query('SELECT id,username,role,created_at FROM users');
  res.json(rows);
});
app.post('/users', authenticate, authorize(['admin']),
  body('username').notEmpty(),
  body('password').isLength({ min: 6 }),
  body('role').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const result = await db.execute('INSERT INTO users(username,password_hash,role) VALUES (?,?,?)', [username, hash, role]);
    res.status(201).json({ id: result.insertId, username, role });
  }
);

// --- Turmas ---
app.get('/turmas', authenticate, async (req, res) => {
  const rows = await db.query('SELECT * FROM turmas ORDER BY id DESC');
  res.json(rows);
});
app.post('/turmas', authenticate, authorize(['admin','teacher']), body('nome').notEmpty(), async (req, res) => {
  const { nome, descricao } = req.body;
  const result = await db.execute('INSERT INTO turmas(nome,descricao) VALUES (?,?)', [nome, descricao || null]);
  res.status(201).json({ id: result.insertId, nome, descricao });
});
app.get('/turmas/:id', authenticate, async (req, res) => {
  const id = parseInt(req.params.id);
  const rows = await db.query('SELECT * FROM turmas WHERE id = ?', [id]);
  if (!rows || rows.length === 0) return res.status(404).json({ error: 'not found' });
  res.json(rows[0]);
});
app.put('/turmas/:id', authenticate, authorize(['admin','teacher']), async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, descricao } = req.body;
  await db.execute('UPDATE turmas SET nome = ?, descricao = ? WHERE id = ?', [nome, descricao, id]);
  res.json({ id });
});
app.delete('/turmas/:id', authenticate, authorize(['admin']), async (req, res) => {
  const id = parseInt(req.params.id);
  await db.execute('DELETE FROM turmas WHERE id = ?', [id]);
  res.json({ id });
});
app.get('/turmas/:id/alunos', authenticate, async (req, res) => {
  const id = parseInt(req.params.id);
  const rows = await db.query('SELECT * FROM alunos WHERE turma_id = ?', [id]);
  res.json(rows);
});

// --- Alunos ---
app.get('/alunos', authenticate, async (req, res) => {
  const rows = await db.query('SELECT * FROM alunos ORDER BY id DESC');
  res.json(rows);
});
app.get('/alunos/:id', authenticate, async (req, res) => {
  const id = parseInt(req.params.id);
  const rows = await db.query('SELECT * FROM alunos WHERE id = ?', [id]);
  if (!rows || rows.length === 0) return res.status(404).json({ error: 'not found' });
  res.json(rows[0]);
});
app.post('/alunos', authenticate, authorize(['admin','teacher']), body('nome').notEmpty(), async (req, res) => {
  const { nome, email, turma_id } = req.body;
  const result = await db.execute('INSERT INTO alunos(nome,email,turma_id) VALUES (?,?,?)', [nome, email || null, turma_id || null]);
  res.status(201).json({ id: result.insertId, nome });
});
app.put('/alunos/:id', authenticate, authorize(['admin','teacher']), async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, turma_id } = req.body;
  await db.execute('UPDATE alunos SET nome = ?, email = ?, turma_id = ? WHERE id = ?', [nome, email, turma_id, id]);
  res.json({ id });
});
app.delete('/alunos/:id', authenticate, authorize(['admin']), async (req, res) => {
  const id = parseInt(req.params.id);
  await db.execute('DELETE FROM alunos WHERE id = ?', [id]);
  res.json({ id });
});

// --- Chamada ---
app.post('/chamada', authenticate, authorize(['teacher']), async (req, res) => {
  const { turma_id, data, presentes } = req.body;
  if (!turma_id || !Array.isArray(presentes)) return res.status(400).json({ error: 'turma_id and presentes array required' });
  const dateStr = data || new Date().toISOString().slice(0,10);
  const result = await db.execute('INSERT INTO chamada(turma_id,data,presentes_json) VALUES (?,?,?)', [turma_id, dateStr, JSON.stringify(presentes)]);
  res.status(201).json({ id: result.insertId, turma_id, date: dateStr });
});
app.get('/chamada/turma/:id', authenticate, async (req, res) => {
  const id = parseInt(req.params.id);
  const rows = await db.query('SELECT * FROM chamada WHERE turma_id = ? ORDER BY data DESC', [id]);
  res.json(rows);
});

// health
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
