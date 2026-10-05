import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialTasks } from '../data/seedTasks.js';
import { getDBStatus } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'tasks.json');

// --- 1. Mongoose Schema Definition ---
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['To Do', 'In Progress', 'In Review', 'Done'],
      default: 'To Do'
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    dueDate: {
      type: String,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    assignedTo: {
      id: { type: String, default: '' },
      name: { type: String, default: 'Unassigned' },
      email: { type: String, default: '' },
      avatar: { type: String, default: '' }
    },
    createdBy: {
      id: { type: String, required: true },
      name: { type: String, required: true }
    },
    projectId: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const MongoTask = mongoose.models.Task || mongoose.model('Task', TaskSchema);

// --- 2. Local Persistent File Storage Engine ---
function ensureLocalStore() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialTasks, null, 2), 'utf-8');
  }
}

function readLocalStore() {
  ensureLocalStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local tasks JSON store:', err);
    return [...initialTasks];
  }
}

function writeLocalStore(tasks) {
  ensureLocalStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

// --- 3. Unified TaskRepository Layer ---
export const TaskRepository = {
  async findAll({ search, status, priority, assignedTo, sortBy = 'createdAt', order = 'desc' } = {}) {
    const { isMongoConnected } = getDBStatus();

    if (isMongoConnected) {
      const filter = {};
      if (status && status !== 'All') filter.status = status;
      if (priority && priority !== 'All') filter.priority = priority;
      if (assignedTo && assignedTo !== 'All') filter['assignedTo.id'] = assignedTo;

      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { title: regex },
          { description: regex },
          { tags: regex },
          { 'assignedTo.name': regex }
        ];
      }

      const sortDirection = order === 'asc' ? 1 : -1;
      const tasks = await MongoTask.find(filter).sort({ [sortBy]: sortDirection });
      return tasks.map((t) => t.toJSON());
    }

    // Local JSON Store implementation
    let tasks = readLocalStore();

    if (status && status !== 'All') {
      tasks = tasks.filter((t) => t.status === status);
    }
    if (priority && priority !== 'All') {
      tasks = tasks.filter((t) => t.priority === priority);
    }
    if (assignedTo && assignedTo !== 'All') {
      tasks = tasks.filter((t) => t.assignedTo?.id === assignedTo);
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      tasks = tasks.filter((t) =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        (Array.isArray(t.tags) && t.tags.some((tag) => tag.toLowerCase().includes(q))) ||
        t.assignedTo?.name?.toLowerCase().includes(q)
      );
    }

    tasks.sort((a, b) => {
      const aVal = a[sortBy] ? (sortBy === 'dueDate' ? new Date(a[sortBy]).getTime() : new Date(a[sortBy]).getTime()) : 0;
      const bVal = b[sortBy] ? (sortBy === 'dueDate' ? new Date(b[sortBy]).getTime() : new Date(b[sortBy]).getTime()) : 0;
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return tasks;
  },

  async findById(id) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const task = await MongoTask.findById(id);
      return task ? task.toJSON() : null;
    }

    const tasks = readLocalStore();
    return tasks.find((t) => t.id === id) || null;
  },

  async create(data) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      const newTask = await MongoTask.create(data);
      return newTask.toJSON();
    }

    const tasks = readLocalStore();
    const newTask = {
      id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: data.title,
      description: data.description || '',
      status: data.status || 'To Do',
      priority: data.priority || 'Medium',
      dueDate: data.dueDate || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      assignedTo: data.assignedTo || { id: '', name: 'Unassigned', email: '', avatar: '' },
      createdBy: data.createdBy,
      projectId: data.projectId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    writeLocalStore(tasks);
    return newTask;
  },

  async update(id, updateData) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const updated = await MongoTask.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });
      return updated ? updated.toJSON() : null;
    }

    const tasks = readLocalStore();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...updateData,
      id: tasks[index].id,
      updatedAt: new Date().toISOString()
    };

    writeLocalStore(tasks);
    return tasks[index];
  },

  async delete(id) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return false;
      const result = await MongoTask.findByIdAndDelete(id);
      return Boolean(result);
    }

    const tasks = readLocalStore();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;

    writeLocalStore(filtered);
    return true;
  },

  async getStatistics() {
    const tasks = await this.findAll({});
    const totalTasks = tasks.length;

    const byStatus = {
      'To Do': 0,
      'In Progress': 0,
      'In Review': 0,
      Done: 0
    };

    const byPriority = {
      Low: 0,
      Medium: 0,
      High: 0,
      Urgent: 0
    };

    const todayStr = new Date().toISOString().split('T')[0];
    let overdueCount = 0;

    tasks.forEach((t) => {
      if (t.status && byStatus[t.status] !== undefined) {
        byStatus[t.status]++;
      }
      if (t.priority && byPriority[t.priority] !== undefined) {
        byPriority[t.priority]++;
      }
      if (t.dueDate && t.status !== 'Done' && t.dueDate < todayStr) {
        overdueCount++;
      }
    });

    const completionRate = totalTasks > 0 ? Math.round((byStatus.Done / totalTasks) * 100) : 0;

    return {
      totalTasks,
      byStatus,
      byPriority,
      overdueCount,
      completionRate
    };
  }
};
