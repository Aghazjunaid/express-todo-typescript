import cron from 'node-cron';
import { expireTasks } from '../controllers/task.controller';

export const job = cron.schedule('* * * * *', expireTasks);
