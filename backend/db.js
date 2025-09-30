// Backend/db.js - MySQL helper (mysql2/promise)
// Edit DB_CONFIG to match sua instalação local do MySQL
const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: '127.0.0.1',   // ajuste se necessário
  port: 3306,
  user: 'root',        // coloque seu usuário MySQL
  password: '',        // coloque sua senha MySQL
  database: 'sigeas_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

async function getPool() {
  if (!pool) pool = mysql.createPool(DB_CONFIG);
  return pool;
}

// generic query: retorna rows (SELECT) ou info (INSERT/UPDATE)
async function query(sql, params = []) {
  const p = await getPool();
  const [rows] = await p.query(sql, params);
  return rows;
}

// execute for inserts/updates returning result object (with insertId)
async function execute(sql, params = []) {
  const p = await getPool();
  const [result] = await p.execute(sql, params);
  return result;
}

// helper seeds DB if empty (call once at startup)
async function seedIfNeeded() {
  const p = await getPool();
  const [rows] = await p.query('SHOW TABLES LIKE "users"');
  // if tables don't exist, user should run schema.sql manually
  // But try create minimal users table if missing
  const [check] = await p.query("SELECT COUNT(*) as cnt FROM information_schema.tables WHERE table_schema = ? AND table_name = 'users'", [DB_CONFIG.database]);
  if (check && check[0] && check[0].cnt === 0) {
    // tables likely missing; do nothing (server will fail, but instruct user to run schema.sql)
    console.warn('Tabela users não encontrada. Rode schema.sql para criar o schema.');
    return;
  }
  const users = await p.query('SELECT COUNT(*) as cnt FROM users');
  if (users && users[0] && users[0].length && users[0][0].cnt === 0) {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('admin123', 10);
    await p.query('INSERT INTO users(username,password_hash,role) VALUES (?,?,?)', ['admin', hash, 'admin']);
    console.log('Usuário admin seedado: admin / admin123');
  } else {
    // older format of rows: mysql2/promise returns rows direct for query
    const cnt = users && users[0] && users[0].cnt !== undefined ? users[0].cnt : (users && users.cnt ? users.cnt : null);
    if (cnt === 0) {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('admin123', 10);
      await p.query('INSERT INTO users(username,password_hash,role) VALUES (?,?,?)', ['admin', hash, 'admin']);
      console.log('Usuário admin seedado: admin / admin123');
    }
  }
}

module.exports = { query, execute, getPool, seedIfNeeded };
