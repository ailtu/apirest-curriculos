import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Listar todas as experiências
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experiencias ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar experiência por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM experiencias WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Experiência não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar nova experiência
router.post('/', async (req, res) => {
  const { pessoa_id, cargo, empresa, ano_inicio, ano_fim } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO experiencias (pessoa_id, cargo, empresa, ano_inicio, ano_fim) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [pessoa_id, cargo, empresa, ano_inicio, ano_fim]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar experiência
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { cargo, empresa, ano_inicio, ano_fim } = req.body;
  try {
    const result = await pool.query(
      'UPDATE experiencias SET cargo=$1, empresa=$2, ano_inicio=$3, ano_fim=$4 WHERE id=$5 RETURNING *',
      [cargo, empresa, ano_inicio, ano_fim, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Experiência não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar experiência
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM experiencias WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Experiência não encontrada' });
    res.json({ message: 'Experiência removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
