import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialProjects } from '../data/seedData.js';
import { getDBStatus } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'projects.json');

// --- 1. Mongoose Schema Definition ---
const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Full Stack', 'Frontend', 'Backend', 'Mobile', 'AI/ML', 'Cloud', 'IoT', 'Other'],
      default: 'Full Stack'
    },
    techStack: {
      type: [String],
      required: [true, 'At least one tech stack tag is required'],
      validate: {
        validator: (tags) => Array.isArray(tags) && tags.length > 0,
        message: 'Must provide at least one technology tag'
      }
    },
    repoUrl: {
      type: String,
      trim: true,
      default: ''
    },
    liveUrl: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Planned', 'In Progress', 'Completed'],
      default: 'In Progress'
    },
    featured: {
      type: Boolean,
      default: false
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

export const MongoProject = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

// --- 2. Local Persistent File Storage Engine ---
function ensureLocalStore() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialProjects, null, 2), 'utf-8');
  }
}

function readLocalStore() {
  ensureLocalStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local JSON store:', err);
    return [...initialProjects];
  }
}

function writeLocalStore(projects) {
  ensureLocalStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

// --- 3. Unified Repository Layer ---
export const ProjectRepository = {
  async findAll({ search, category, status, sortBy = 'createdAt', order = 'desc' } = {}) {
    const { isMongoConnected } = getDBStatus();

    if (isMongoConnected) {
      const filter = {};
      if (category && category !== 'All') {
        filter.category = category;
      }
      if (status && status !== 'All') {
        filter.status = status;
      }
      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { title: regex },
          { description: regex },
          { techStack: regex }
        ];
      }
      const sortDirection = order === 'asc' ? 1 : -1;
      const projects = await MongoProject.find(filter).sort({ [sortBy]: sortDirection });
      return projects.map((p) => p.toJSON());
    }

    // Local JSON implementation
    let projects = readLocalStore();

    if (category && category !== 'All') {
      projects = projects.filter((p) => p.category === category);
    }
    if (status && status !== 'All') {
      projects = projects.filter((p) => p.status === status);
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          (Array.isArray(p.techStack) && p.techStack.some((t) => t.toLowerCase().includes(q)))
      );
    }

    projects.sort((a, b) => {
      const aVal = a[sortBy] ? new Date(a[sortBy]).getTime() : 0;
      const bVal = b[sortBy] ? new Date(b[sortBy]).getTime() : 0;
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return projects;
  },

  async findById(id) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const project = await MongoProject.findById(id);
      return project ? project.toJSON() : null;
    }

    const projects = readLocalStore();
    return projects.find((p) => p.id === id) || null;
  },

  async create(data) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      const newProj = await MongoProject.create(data);
      return newProj.toJSON();
    }

    const projects = readLocalStore();
    const newProject = {
      id: `proj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: data.title,
      description: data.description,
      category: data.category || 'Full Stack',
      techStack: Array.isArray(data.techStack) ? data.techStack : [],
      repoUrl: data.repoUrl || '',
      liveUrl: data.liveUrl || '',
      status: data.status || 'In Progress',
      featured: Boolean(data.featured),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.unshift(newProject);
    writeLocalStore(projects);
    return newProject;
  },

  async update(id, updateData) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const updated = await MongoProject.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });
      return updated ? updated.toJSON() : null;
    }

    const projects = readLocalStore();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    projects[index] = {
      ...projects[index],
      ...updateData,
      id: projects[index].id,
      updatedAt: new Date().toISOString()
    };

    writeLocalStore(projects);
    return projects[index];
  },

  async delete(id) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return false;
      const result = await MongoProject.findByIdAndDelete(id);
      return Boolean(result);
    }

    const projects = readLocalStore();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length === projects.length) return false;

    writeLocalStore(filtered);
    return true;
  },

  async getStatistics() {
    const projects = await this.findAll({});
    const totalProjects = projects.length;

    const byStatus = {
      Completed: 0,
      'In Progress': 0,
      Planned: 0
    };

    const categoryMap = {};
    const techCounts = {};

    projects.forEach((p) => {
      if (p.status && byStatus[p.status] !== undefined) {
        byStatus[p.status]++;
      }
      if (p.category) {
        categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
      }
      if (Array.isArray(p.techStack)) {
        p.techStack.forEach((tech) => {
          techCounts[tech] = (techCounts[tech] || 0) + 1;
        });
      }
    });

    const topTechnologies = Object.entries(techCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    return {
      totalProjects,
      byStatus,
      byCategory: categoryMap,
      topTechnologies
    };
  }
};
