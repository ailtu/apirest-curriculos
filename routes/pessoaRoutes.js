import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Listar todas as pessoas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pessoas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar pessoa por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM pessoas WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pessoa não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar nova pessoa
router.post('/', async (req, res) => {
  const { nome, email, telefone, resumo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pessoas (nome, email, telefone, resumo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, telefone, resumo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar pessoa
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, resumo } = req.body;
  try {
    const result = await pool.query(
      'UPDATE pessoas SET nome=$1, email=$2, telefone=$3, resumo=$4 WHERE id=$5 RETURNING *',
      [nome, email, telefone, resumo, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pessoa não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar pessoa
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM pessoas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pessoa não encontrada' });
    res.json({ message: 'Pessoa removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
