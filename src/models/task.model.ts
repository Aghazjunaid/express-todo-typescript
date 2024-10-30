import mongoose, { Schema, Model, Document } from 'mongoose';

type TaskDocument = Document & {
  title: string;
  description: string | null;
  dueDate: Date;
  completed: boolean;
  user: string;
};

type TaskInput = {
  title: TaskDocument['title'];
  description: TaskDocument['description'];
  dueDate: TaskDocument['dueDate'];
  completed: TaskDocument['completed'];
  user: TaskDocument['user'];
};

const taskSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      default: null,
    },
    dueDate: {
      type: Schema.Types.Date,
      required: true,
    },
    completed: {
      type: Schema.Types.String,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId, 
      ref:"users"
    },
  },
  {
    collection: 'tasks',
    timestamps: true,
  },
);

const Task: Model<TaskDocument> = mongoose.model<TaskDocument>('Task', taskSchema);

export { Task, TaskInput, TaskDocument };