CREATE DATABASE IF NOT EXISTS sigeas_db;
USE sigeas_db;

-- Usuários (admin, professor, aluno)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role ENUM('admin','teacher','student') NOT NULL
);

-- Turmas
CREATE TABLE turmas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT
);

-- Alunos (ligados a users e turmas)
CREATE TABLE alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  turma_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE
);

-- Chamadas (cada data de chamada por turma)
CREATE TABLE chamadas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  turma_id INT NOT NULL,
  data DATE NOT NULL,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE
);

-- Presenças (aluno presente ou ausente em uma chamada)
CREATE TABLE presencas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chamada_id INT NOT NULL,
  aluno_id INT NOT NULL,
  presente BOOLEAN NOT NULL,
  FOREIGN KEY (chamada_id) REFERENCES chamadas(id) ON DELETE CASCADE,
  FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
);

-- Inserir usuário admin padrão
INSERT INTO users (nome, email, senha, role) VALUES
('Administrador', 'admin@sigeas.com', '$2b$10$7QJ5Zb9O7/5YiG3oY0CaeuqxWB7Vf5RjTn0Nf5Zk3bE4vYkgOVaGu', 'admin');
-- senha = admin123
