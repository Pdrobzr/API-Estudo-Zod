import express from 'express';
import { router } from './router';
import { env } from './schemas/envSchema';

const app = express();


app.use(express.json());
app.use(router);


app.listen(8081, () => console.log(`Servidor rodando na porta ${env.PORT}!`));