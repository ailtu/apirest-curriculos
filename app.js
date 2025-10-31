import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import pessoaRoutes from './routes/pessoaRoutes.js';
import formacaoRoutes from './routes/formacaoRoutes.js';
import experienciaRoutes from './routes/experienciaRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/pessoas', pessoaRoutes);
app.use('/formacoes', formacaoRoutes);
app.use('/experiencias', experienciaRoutes);

app.get('/', (req, res) => {
  res.send('API REST do Currículo');
});

export default app;