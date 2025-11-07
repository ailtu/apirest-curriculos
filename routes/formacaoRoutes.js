import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Listar todas as formações
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM formacoes ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar formação por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM formacoes WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Formação não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar nova formação
router.post('/', async (req, res) => {
  const { pessoa_id, curso, instituicao, ano_conclusao } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO formacoes (pessoa_id, curso, instituicao, ano_conclusao) VALUES ($1, $2, $3, $4) RETURNING *',
      [pessoa_id, curso, instituicao, ano_conclusao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar formação
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { curso, instituicao, ano_conclusao } = req.body;
  try {
    const result = await pool.query(
      'UPDATE formacoes SET curso=$1, instituicao=$2, ano_conclusao=$3 WHERE id=$4 RETURNING *',
      [curso, instituicao, ano_conclusao, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Formação não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar formação
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM formacoes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Formação não encontrada' });
    res.json({ message: 'Formação removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
