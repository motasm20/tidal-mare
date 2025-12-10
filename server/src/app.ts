import express from 'express';
import cors from 'cors';
import { config } from './config';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

export default app;
