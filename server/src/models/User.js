import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDBStatus } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'users.json');

// --- 1. Mongoose Schema Definition ---
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    },
    avatar: {
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
        delete ret.password;
        return ret;
      }
    }
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);

// --- 2. Initial Default Users for Local Persistence Store ---
const defaultHashedPassword = bcrypt.hashSync('password123', 10);

export const initialUsers = [
  {
    id: 'user-admin-1',
    name: 'Alex Morgan',
    email: 'alex@demo.com',
    password: defaultHashedPassword,
    role: 'admin',
    avatar: 'AM',
    createdAt: new Date('2026-01-10T09:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-01-10T09:00:00.000Z').toISOString()
  },
  {
    id: 'user-member-2',
    name: 'Sarah Chen',
    email: 'sarah@demo.com',
    password: defaultHashedPassword,
    role: 'member',
    avatar: 'SC',
    createdAt: new Date('2026-01-15T11:30:00.000Z').toISOString(),
    updatedAt: new Date('2026-01-15T11:30:00.000Z').toISOString()
  },
  {
    id: 'user-member-3',
    name: 'David Kim',
    email: 'david@demo.com',
    password: defaultHashedPassword,
    role: 'member',
    avatar: 'DK',
    createdAt: new Date('2026-02-01T14:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-02-01T14:00:00.000Z').toISOString()
  }
];

// --- 3. Local Persistent File Storage Engine ---
function ensureLocalStore() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8');
  }
}

function readLocalStore() {
  ensureLocalStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local users JSON store:', err);
    return [...initialUsers];
  }
}

function writeLocalStore(users) {
  ensureLocalStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function sanitizeUser(user) {
  if (!user) return null;
  const copy = { ...user };
  delete copy.password;
  return copy;
}

// --- 4. Unified UserRepository ---
export const UserRepository = {
  async findByEmail(email) {
    const normalized = email.trim().toLowerCase();
    const { isMongoConnected } = getDBStatus();

    if (isMongoConnected) {
      const user = await MongoUser.findOne({ email: normalized });
      if (!user) return null;
      const json = user.toJSON();
      json.password = user.password; // keep password for comparison in auth controller
      return json;
    }

    const users = readLocalStore();
    return users.find((u) => u.email.toLowerCase() === normalized) || null;
  },

  async findById(id) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;
      const user = await MongoUser.findById(id);
      return user ? user.toJSON() : null;
    }

    const users = readLocalStore();
    const user = users.find((u) => u.id === id);
    return sanitizeUser(user);
  },

  async findAll() {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      const users = await MongoUser.find().select('-password').sort({ name: 1 });
      return users.map((u) => u.toJSON());
    }

    const users = readLocalStore();
    return users.map(sanitizeUser).sort((a, b) => a.name.localeCompare(b.name));
  },

  async create({ name, email, password, role = 'member', avatar }) {
    const normalized = email.trim().toLowerCase();
    const { isMongoConnected } = getDBStatus();

    const initials = avatar || name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

    if (isMongoConnected) {
      const newUser = await MongoUser.create({
        name,
        email: normalized,
        password,
        role,
        avatar: initials
      });
      return newUser.toJSON();
    }

    const users = readLocalStore();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      email: normalized,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'member',
      avatar: initials,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    writeLocalStore(users);
    return sanitizeUser(newUser);
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
};
