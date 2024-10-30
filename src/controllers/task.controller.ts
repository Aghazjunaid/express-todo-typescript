import { Request, Response } from 'express';
import { Task, TaskInput } from '../models/task.model';

interface CustomRequest extends Request {
  token: {
    _id: string;
  };
}

export const createTask = async (req: Request, res: Response) => {
  const { description, title, dueDate } = req.body;

  if (!title || !dueDate) {
    return res.status(422).json({
      message: 'The fields title and dueDate are required',
    });
  }

  const dueDateObj = new Date(dueDate);
  const now = new Date();

  if (dueDateObj < now) {
    return res.status(422).json({
      message: 'The dueDate cannot be in the past',
    });
  }

  const roleInput: TaskInput = {
    title,
    description,
    dueDate,
    completed: false,
    user: (req as CustomRequest).token._id,
  };

  try {
    const roleCreated = await Task.create(roleInput);

    return res.status(200).json({ data: roleCreated });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({
      user: (req as CustomRequest).token._id,
    })
      .sort('-createdAt')
      .exec();

    return res.status(200).json({ data: tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, user: (req as CustomRequest).token._id });

    if (!task) {
      return res.status(404).json({ message: `Task with id "${id}" not found.` });
    }

    return res.status(200).json({ data: task });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, title, dueDate, completed } = req.body;

  if (dueDate) {
    const dueDateObj = new Date(dueDate);
    const now = new Date();

    if (dueDateObj < now) {
      return res.status(422).json({
        message: 'The dueDate cannot be in the past',
      });
    }
  }

  try {
    const task = await Task.findOne({ _id: id, user: (req as CustomRequest).token._id });

    if (!task) {
      return res.status(404).json({ message: `Task with id "${id}" not found.` });
    }

    await Task.updateOne({ _id: id, user: (req as CustomRequest).token._id }, { title, description, dueDate, completed });

    const taskUpdated = await Task.findById(id);

    return res.status(200).json({ data: taskUpdated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete({ _id: id, user: (req as CustomRequest).token._id });

    if (!deletedTask) {
      return res.status(404).json({ message: `Task with id "${id}" not found.` });
    }

    return res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const expireTasks = async () => {
  try {
    const now = new Date();
    console.log(now);

    await Task.updateMany(
      {
        dueDate: { $lt: now },
      },
      { completed: true },
    );
  } catch (error) {
    //push error to sentry or kafka topic to track
    console.log(error);
  }
};