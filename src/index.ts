import express from 'express';
import { connectToDatabase } from './db-connection';
import { roleRoutes } from './routes/task.route';
import { userRoutes } from './routes/user.route';
import { job } from './utils/job';

const HOST = 'http://localhost';
const PORT = parseInt('4500');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', roleRoutes());
app.use('/', userRoutes());

job.start();

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World!' });
});

app.listen(PORT, async () => {
  await connectToDatabase();

  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});