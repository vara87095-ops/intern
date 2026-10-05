import { TaskRepository } from '../models/Task.js';
import { emitTaskCreated, emitTaskUpdated, emitTaskDeleted } from '../socket/socketHandler.js';

export async function getTasks(req, res) {
  try {
    const { search, status, priority, assignedTo, sortBy, order } = req.query;

    const tasks = await TaskRepository.findAll({
      search,
      status,
      priority,
      assignedTo,
      sortBy,
      order
    });

    return res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks',
      error: error.message
    });
  }
}

export async function getTaskById(req, res) {
  try {
    const task = await TaskRepository.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    return res.json({
      success: true,
      data: task
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve task',
      error: error.message
    });
  }
}

export async function createTask(req, res) {
  try {
    const { title, description, status, priority, dueDate, tags, assignedTo, projectId } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const newTask = await TaskRepository.create({
      title: title.trim(),
      description: description || '',
      status: status || 'To Do',
      priority: priority || 'Medium',
      dueDate: dueDate || '',
      tags: Array.isArray(tags) ? tags : [],
      assignedTo: assignedTo || {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar || req.user.name.substring(0, 2).toUpperCase()
      },
      createdBy: {
        id: req.user.id,
        name: req.user.name
      },
      projectId: projectId || ''
    });

    // Real-time broadcast
    emitTaskCreated(newTask, req.user);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const existing = await TaskRepository.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const updatedTask = await TaskRepository.update(id, req.body);

    // Real-time broadcast
    emitTaskUpdated(updatedTask, req.user);

    return res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
}

export async function updateTaskStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['To Do', 'In Progress', 'In Review', 'Done'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`
      });
    }

    const existing = await TaskRepository.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const updatedTask = await TaskRepository.update(id, { status });

    // Real-time broadcast
    emitTaskUpdated(updatedTask, req.user);

    return res.json({
      success: true,
      message: `Task moved to ${status}`,
      data: updatedTask
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update task status',
      error: error.message
    });
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const existing = await TaskRepository.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const success = await TaskRepository.delete(id);
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete task'
      });
    }

    // Real-time broadcast
    emitTaskDeleted(id, req.user);

    return res.json({
      success: true,
      message: 'Task deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
}

export async function getTaskStats(req, res) {
  try {
    const stats = await TaskRepository.getStatistics();
    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve task statistics',
      error: error.message
    });
  }
}
